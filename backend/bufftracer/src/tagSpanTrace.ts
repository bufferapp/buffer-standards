import {
  APIRequestMetadata,
  GraphQlRequest,
  isGraphQlRequest,
  isRPCRequest,
  RPCRequest,
  TAG_NAME,
} from './types'
import { parseRPCRequest } from './parseRPCRequest'
import { parseGraphQLRequest } from './parseGraphQLRequest'
import { RESOURCE_NAME } from 'dd-trace/ext/tags'
import { Span } from 'dd-trace'

export function tagSpanTrace(
  span: Span | undefined,
  req: RPCRequest | GraphQlRequest,
  errorCallback: (ex: Error) => void,
): boolean {
  try {
    if (!span) return false

    let metadata: APIRequestMetadata | null = null

    if (isRPCRequest(req)) {
      metadata = parseRPCRequest({ req })
    }
    if (isGraphQlRequest(req)) {
      metadata = parseGraphQLRequest({ req })
    }

    if (!metadata) return false

    span.setTag(RESOURCE_NAME, metadata.edge)
    span.setTag(TAG_NAME, metadata)
  } catch (e) {
    errorCallback(e as Error)
    return false
  }
  return true
}
