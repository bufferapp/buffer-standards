import {
  APIRequestMetadata,
  BuffTracerError,
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
  errorCallback: (ex: BuffTracerError) => void,
): void {
  try {
    BuffLog.info('bufftracerdebug', {
      m: 'Checking span before parsing',
      isGraphQLRequest: isGraphQlRequest(req),
      isRPCRequest: isRPCRequest(req),
      span,
    })

    if (!span) return

    let metadata: APIRequestMetadata | null = null

    if (isRPCRequest(req)) {
      metadata = parseRPCRequest({ req })
    }
    if (isGraphQlRequest(req)) {
      metadata = parseGraphQLRequest({ req })
    }

    BuffLog.info('bufftracerdebug', {
      m: 'Metadata generated',
      isGraphQLRequest: isGraphQlRequest(req),
      isRPCRequest: isRPCRequest(req),
      metadata,
      span,
    })

    if (!metadata) return

    BuffLog.info('bufftracerdebug', {
      m: 'Tagging span with metadata',
      isGraphQLRequest: isGraphQlRequest(req),
      isRPCRequest: isRPCRequest(req),
      metadata,
    })

    span.setTag(RESOURCE_NAME, metadata.edge)
    span.setTag(TAG_NAME, metadata)

    BuffLog.info('bufftracerdebug', {
      m: 'Done tagging span with metadata',
      isGraphQLRequest: isGraphQlRequest(req),
      isRPCRequest: isRPCRequest(req),
      metadata,
    })
  } catch (e) {
    BuffLog.info('bufftracerdebug', {
      m: 'Error',
      isGraphQLRequest: isGraphQlRequest(req),
      isRPCRequest: isRPCRequest(req),
      error: e,
    })
    const error = new BuffTracerError((e as Error).message, req)
    errorCallback(error)
  }
}
