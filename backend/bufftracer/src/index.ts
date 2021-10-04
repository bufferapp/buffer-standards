import tracer, { Span, TracerOptions } from 'dd-trace'
import * as env from 'env-var'
import { BuffTracerError, GraphQlRequest, RPCRequest } from './types'
import { tagSpanTrace } from './tagSpanTrace'

export * from './types'

// Export dd-tracer for workers to do tracer.wrap
export { tracer }

export function initTracer(
  tracerOptions: TracerOptions,
  errorCallback: (ex: BuffTracerError) => void,
): void {
  const DD_SERVICE_NAME = env.get('DD_SERVICE_NAME').required().asString()

  const DD_TRACE_AGENT_HOST = env
    .get('DD_TRACE_AGENT_HOST')
    .required()
    .asString()

  const DD_TRACE_AGENT_PORT = env
    .get('DD_TRACE_AGENT_PORT')
    .required()
    .asString()

  const DD_ENABLE_TRACING = env.get('DD_ENABLE_TRACING').required().asBool()
  const APP_STAGE = env.get('APP_STAGE').default('').asString()
  const NODE_ENV = env.get('NODE_ENV').asString()

  tracer.init({
    enabled: DD_ENABLE_TRACING,
    service: DD_SERVICE_NAME,
    hostname: DD_TRACE_AGENT_HOST,
    port: DD_TRACE_AGENT_PORT,
    env: NODE_ENV || APP_STAGE,
    logInjection: true,
    trackAsyncScope: false, // As per https://github.com/DataDog/dd-trace-js/releases/tag/v0.16.0
    ...tracerOptions,
  })

  tracer.use('express', {
    hooks: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request: (
        span: Span | undefined,
        req: RPCRequest | GraphQlRequest,
      ): void => {
        tagSpanTrace(span, req, errorCallback)
      },
    },
  })
}
