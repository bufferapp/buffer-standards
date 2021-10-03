import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  getOperationAST,
  InlineFragmentNode,
  parse,
  Kind,
  DefinitionNode,
  DocumentNode,
} from 'graphql'
import { SelectionNode, SelectionSetNode } from 'graphql/language/ast'
import { APIRequestMetadata, GraphQlRequest } from './types'
import { getClientFromHeader } from './getClientFromHeader'
import * as env from 'env-var'

export function parseGraphQLRequest(args: {
  req: GraphQlRequest
}): APIRequestMetadata | null {
  const { req } = args

  // Parse GraphQL query into an AST (Abstract Syntax Tree) = schema represented in nested object
  const ast = parse(req.body.query)

  // Retrieve the Operation sub-AST corresponding to the query/mutation
  const operationAST = getOperationAST(ast, null)
  if (!operationAST) return null

  const operationType = operationAST.operation.toLowerCase()

  // Retrieve any Fragment sub-ASTs corresponding to spread fragments
  const fragmentASTs = getFragmentASTs({ ast })

  // Parse fields starting from the operation AST
  const result = parseFieldsAndArguments({
    selectionSet: operationAST.selectionSet,
    parentFieldName: operationType,
    fragmentASTs,
  })

  const edge = result.fieldList.shift()?.replace('.', ' ') || 'unknown'

  return {
    name: env.get('DD_SERVICE_NAME').required().asString(),
    type: 'graphql',
    client: getClientFromHeader({ req }),
    edge,
    fields: result.fieldList,
    deprecatedFields: [],
    args: result.argumentList,
  }
}

export function getFragmentASTs(args: {
  ast: DocumentNode
}): Record<string, FragmentDefinitionNode> {
  const result: Record<string, FragmentDefinitionNode> = {}
  for (const definition of args.ast.definitions) {
    if (isFragmentDefinitionNode(definition)) {
      result[definition.name.value] = definition
    }
  }
  return result
}

/**
 * Recursive function trasversing the AST tree and returning a list of fields and arguments
 *  - selectionSet: the current node of the tree section
 *  - parentFieldName: name of the parent field to compose field like 'billing.subscription'
 *  - fragmentASTs: the ASTs corresdonding to spread fragment. As opposed to inline fragment, spread fragment are representend in the operation AST as a leaf.
 *                  So, in order to parse these as fields too, we are going to complete the tree ourselves when we reach a spread fragment leaf.
 */
function parseFieldsAndArguments(args: {
  selectionSet: SelectionSetNode
  parentFieldName: string
  fragmentASTs: Record<string, FragmentDefinitionNode>
}): { fieldList: Array<string>; argumentList: Array<string> } {
  const { selectionSet, parentFieldName, fragmentASTs } = args

  let fieldList: Array<string> = []
  let argumentList: Array<string> = []

  // Else, loop over each child node of the current node
  for (const selectionNode of selectionSet.selections) {
    let childrenResult: {
      fieldList: Array<string>
      argumentList: Array<string>
    }

    if (isFieldNode(selectionNode)) {
      // Get name of current node and add it to the list
      const fieldName = selectionNode.name.value
      fieldList.push(`${parentFieldName}.${fieldName}`)

      // Get the arguments of the node if any
      if (selectionNode.arguments) {
        for (const fieldArgument of selectionNode.arguments) {
          argumentList.push(
            `${parentFieldName}.${fieldName}.${fieldArgument.name.value}`,
          )
        }
      }

      // Continue with child elements
      if (selectionNode.selectionSet) {
        childrenResult = parseFieldsAndArguments({
          selectionSet: selectionNode.selectionSet,
          parentFieldName: fieldName,
          fragmentASTs,
        })
        fieldList = fieldList.concat(childrenResult.fieldList)
        argumentList = argumentList.concat(childrenResult.argumentList)
      }
    } else if (isInlineFragmentNode(selectionNode)) {
      // Get name of current node and add it to the list
      // i.e. billing.OBBilling
      const fieldName = selectionNode.typeCondition?.name.value
      fieldList.push(`${parentFieldName}.${fieldName}`)

      // Continue with child elements
      childrenResult = parseFieldsAndArguments({
        selectionSet: selectionNode.selectionSet,
        parentFieldName: parentFieldName, // Here we don't want to pass the fragment name, we want to produce 'billing.subscription' and not 'OBBilling.subscription'
        fragmentASTs,
      })
      fieldList = fieldList.concat(childrenResult.fieldList)
      argumentList = argumentList.concat(childrenResult.argumentList)
    } else if (isFragmentSpreadNode(selectionNode)) {
      // Get name of the spread fragment and add it to the list
      // i.e. organization.ChannelsFields
      const fieldName = selectionNode.name.value
      fieldList.push(`${parentFieldName}.${fieldName}`)

      // We reached a leaf of the opertion AST that is a fragment node
      // If we have an AST for the spread fragment, let's use to keep on going
      if (fragmentASTs[fieldName]) {
        childrenResult = parseFieldsAndArguments({
          selectionSet: fragmentASTs[fieldName].selectionSet,
          parentFieldName: parentFieldName, // Here we don't want to pass the fragment name, we want to produce 'organization.channels' and not 'ChannelsFields.channels'
          fragmentASTs,
        })
        fieldList = fieldList.concat(childrenResult.fieldList)
        argumentList = argumentList.concat(childrenResult.argumentList)
      }
    }
  }
  return { fieldList, argumentList }
}

function isFieldNode(selectionNode: SelectionNode): selectionNode is FieldNode {
  return selectionNode.kind === Kind.FIELD
}

function isInlineFragmentNode(
  selectionNode: SelectionNode,
): selectionNode is InlineFragmentNode {
  return selectionNode.kind === Kind.INLINE_FRAGMENT
}

function isFragmentSpreadNode(
  selectionNode: SelectionNode,
): selectionNode is FragmentSpreadNode {
  return selectionNode.kind === Kind.FRAGMENT_SPREAD
}

function isFragmentDefinitionNode(
  definitionNode: DefinitionNode,
): definitionNode is FragmentDefinitionNode {
  return definitionNode.kind === Kind.FRAGMENT_DEFINITION
}
