# BuffTracer

A Datadog wrapper library to enable DD APM and tag API traces

## Getting Started

### Install npm package
```shell
npm install --save-exact @bufferapp/bufftracer
```

### Initialize tracer at the start of the service
This should be the first import in your `index.ts`file.
```typescript
import '@bufferapp/bufftracer'
```

### Declare the following required env variables in the helm charts of each service
```yaml
  // core-api.yaml

  - name: DD_TRACING_ENABLED
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

## What it does

The library parses the incoming request, generates metadata, sets DD resource name to be the edge/endpoint and tags the DD span with the metadata.

#### API metadata format

```typescript
type APIRequestMetadata = {
  name: 'core-api' | string
  type: 'graphql' | 'rpc' | 'rest'
  client: 'buffertools-graphql-playground' | string
  edge: string
  fields: Array<string>
  deprecatedFields: Array<string>
  args: Array<string>
}
```

#### Datadog APM tag
![image](https://user-images.githubusercontent.com/727592/135768930-aee25005-4af3-49f9-b34a-bbcf0646f320.png)

The DD APM tags are then used to generate DD custom metrics named `api.request`, which we can use to build dashboard and know who is consuming which parts of our API.

## Migration guide

The version 1.0.0 contains breaking changes. In order to upgrade you need to make the following changes in your application:
 - Requires Node.js version v18 or greater
 - Change the environment variable `DD_ENABLE_TRACING` to `DD_TRACING_ENABLED`