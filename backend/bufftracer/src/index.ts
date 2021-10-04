import tracer, { Span } from 'dd-trace'
import * as env from 'env-var'
import { GraphQlRequest, RPCRequest } from './types'
import { tagSpanTrace } from './tagSpanTrace'

export * from './types'

// Export dd-tracer for workers to do tracer.wrap
export { tracer }

const DD_ENABLE_TRACING = env.get('DD_ENABLE_TRACING').required().asBool()
const DD_SERVICE_NAME = env
  .get('DD_SERVICE_NAME')
  .required(DD_ENABLE_TRACING)
  .asString()

const DD_TRACE_AGENT_HOSTNAME = env
  .get('DD_TRACE_AGENT_HOSTNAME')
  .required(DD_ENABLE_TRACING)
  .asString()

const DD_TRACE_AGENT_PORT = env
  .get('DD_TRACE_AGENT_PORT')
  .required(DD_ENABLE_TRACING)
  .asString()

const APP_STAGE = env.get('APP_STAGE').default('').asString()
const NODE_ENV = env.get('NODE_ENV').asString()

tracer.init({
  enabled: DD_ENABLE_TRACING,
  service: DD_SERVICE_NAME,
  hostname: DD_TRACE_AGENT_HOSTNAME,
  port: DD_TRACE_AGENT_PORT,
  env: NODE_ENV || APP_STAGE,
  logInjection: true,
  trackAsyncScope: false, // As per https://github.com/DataDog/dd-trace-js/releases/tag/v0.16.0
})

tracer.use('express', {
  hooks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request: (
      span: Span | undefined,
      req: RPCRequest | GraphQlRequest,
    ): void => {
      tagSpanTrace(span, req)
    },
  },
})
