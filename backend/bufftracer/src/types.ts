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

// todo: use VError in the future
export class BuffTracerError extends Error {
  readonly name: string = 'BuffTracerError'
  readonly req: GraphQlRequest | RPCRequest

  constructor(message: string, req: GraphQlRequest | RPCRequest) {
    super(`Error while tagging API span: ${message}`)
    this.req = req
  }
}
