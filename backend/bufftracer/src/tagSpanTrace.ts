import {
  APIRequestMetadata,
  GraphQlRequest,
  RPCRequest,
  TAG_NAME,
} from './types'
import { parseRPCRequest } from './parseRPCRequest'
import { parseGraphQLRequest } from './parseGraphQLRequest'
import { RESOURCE_NAME } from 'dd-trace/ext/tags'
import { Span } from 'dd-trace'
import { isGraphQlRequest, isRPCRequest } from './utils'
import * as BuffLog from '@bufferapp/bufflog'

export function tagSpanTrace(
  span: Span | undefined,
  req: RPCRequest | GraphQlRequest,
): void {
  try {
    if (!span) return

    let metadata: APIRequestMetadata | null = null

    if (isRPCRequest(req)) {
      metadata = parseRPCRequest({ req })
    }
    if (isGraphQlRequest(req)) {
      metadata = parseGraphQLRequest({ req })
    }

    if (!metadata) return

    span.setTag(RESOURCE_NAME, metadata.edge)
    span.setTag(TAG_NAME, metadata)
  } catch (e) {
    BuffLog.error('Bufftracer: error while tagging span', {
      cause: (e as Error).message,
    })
  }
}
