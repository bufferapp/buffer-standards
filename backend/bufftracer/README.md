# BuffTracer

A Datadog wrapper library to enable DD APM and tag API traces

# How to use

### Install npm package
```shell
npm install --save-exact @bufferapp/bufftracer
```

### Initialize tracer at the start of the service
```typescript
import { initTracer } from '@bufferapp/bufftracer'

initTracer({
  // override any dd-tracer configuration here
}, (error: Error):void => { 
  // report error with Bufflog and to bugnag
})
```

### Declare the following required env variables in the helm charts of each service
```yaml
  // core-api.yaml

  - name: DD_ENABLE_TRACING
    value: 'true'
  - name: DD_SERVICE_NAME
    value: 'core-api'
  - name: DD_TRACE_AGENT_HOSTNAME
    valueFrom:
      fieldRef:
        fieldPath: status.hostIP
  - name: DD_TRACE_AGENT_PORT
    value: '8126'
  - name: NODE_ENV # or APP_STAGE
    value: production
```

