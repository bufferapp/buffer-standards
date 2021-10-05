import { GraphQlRequest, RPCRequest } from './types'

export function isGraphQlRequest(
  req: GraphQlRequest | RPCRequest,
): req is GraphQlRequest {
  // Any GraphQL request (query or mutation) is passed as a string in bode.query
  return req?.body && 'query' in req.body
}

export function isRPCRequest(
  req: GraphQlRequest | RPCRequest,
): req is RPCRequest {
  const hasNameInBody = req?.body && 'name' in req.body
  const hasMethodInParams = req?.params && 'method' in req.params
  const hasArgsInBody = req?.body && 'args' in req.body

  return (hasNameInBody || hasMethodInParams) && hasArgsInBody
}
