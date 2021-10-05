import { GraphQlRequest, RPCRequest } from './types'

export const HEADER_CLIENT_ID = 'x-buffer-client-id'
export const HEADER_CLIENT_UNKNOWN = 'unknown'

export function getClientFromHeader(args: {
  req: RPCRequest | GraphQlRequest
}): string {
  const { req } = args

  return req.headers[HEADER_CLIENT_ID] || HEADER_CLIENT_UNKNOWN
}
