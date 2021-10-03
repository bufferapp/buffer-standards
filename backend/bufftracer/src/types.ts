export const TAG_NAME = 'api'

export type APIRequestMetadata = {
  name: 'core-api' | string
  type: 'graphql' | 'rpc' | 'rest'
  client: 'buffertools-graphql-playground' | string
  edge: string
  fields: Array<string>
  deprecatedFields: Array<string>
  args: Array<string>
}

type Request<P, B> = {
  headers: Record<string, string>
  params: P
  body: B
}
export type GraphQlRequest = Request<Record<string, never>, { query: string }>
export type RPCRequest = Request<
  { method?: string },
  { name?: string; args?: string | Record<string, unknown> }
>

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
