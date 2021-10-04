import tracer, { Span, TracerOptions } from 'dd-trace'
import * as env from 'env-var'
import * as BuffLog from '@bufferapp/bufflog'
import { BuffTracerError, GraphQlRequest, RPCRequest } from './types'
import { tagSpanTrace } from './tagSpanTrace'

export * from './types'

// Export dd-tracer for workers to do tracer.wrap
export { tracer }

export function initTracer(
  tracerOptions: TracerOptions,
  errorCallback: (ex: BuffTracerError) => void,
): void {
  BuffLog.info('bufftracerdebug', {
    m: 'Init lib',
    tracerOptions,
  })

  const DD_ENABLE_TRACING = env.get('DD_ENABLE_TRACING').required().asBool()
  if (!DD_ENABLE_TRACING || tracerOptions.enabled === false) {
    return
  }

  const DD_SERVICE_NAME = env.get('DD_SERVICE_NAME').required().asString()

  const DD_TRACE_AGENT_HOSTNAME = env
    .get('DD_TRACE_AGENT_HOSTNAME')
    .required()
    .asString()

  const DD_TRACE_AGENT_PORT = env
    .get('DD_TRACE_AGENT_PORT')
    .required()
    .asString()

  const APP_STAGE = env.get('APP_STAGE').default('').asString()
  const NODE_ENV = env.get('NODE_ENV').asString()

  const config: TracerOptions = {
    enabled: DD_ENABLE_TRACING,
    service: DD_SERVICE_NAME,
    hostname: DD_TRACE_AGENT_HOSTNAME,
    port: DD_TRACE_AGENT_PORT,
    env: NODE_ENV || APP_STAGE,
    logInjection: true,
    trackAsyncScope: false, // As per https://github.com/DataDog/dd-trace-js/releases/tag/v0.16.0
    ...tracerOptions,
  }

  BuffLog.info('bufftracerdebug', {
    m: 'Initializing tracer.init',
    config,
  })

  tracer.init(config)

  BuffLog.info('bufftracerdebug', {
    m: 'Initializing tracer.user',
    config,
  })
  tracer.use('express', {
    hooks: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request: (
        span: Span | undefined,
        req: RPCRequest | GraphQlRequest,
      ): void => {
        BuffLog.info('bufftracerdebug', {
          m: 'Processing request',
          span,
          req,
        })
        tagSpanTrace(span, req, errorCallback)
        BuffLog.info('bufftracerdebug', {
          m: 'Done processing request',
          span,
          req,
        })
      },
    },
  })
}
