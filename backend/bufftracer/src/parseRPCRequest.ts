import { APIRequestMetadata, RPCRequest } from './types'
import { getClientFromHeader } from './getClientFromHeader'
import * as env from 'env-var'

export function parseRPCRequest(args: { req: RPCRequest }): APIRequestMetadata {
  const { req } = args

  const rpcMethod = req.body.name || req.params.method
  const edge = `rpc ${rpcMethod}`

  const rpcArgs =
    typeof req.body.args === 'string'
      ? JSON.parse(req.body.args)
      : req.body.args || {}

  const argumentList = Object.keys(rpcArgs).map(
    (argumentName) => `rpc.${rpcMethod}.${argumentName}`,
  )

  return {
    name: env.get('DD_SERVICE_NAME').required().asString(),
    type: 'rpc',
    client: getClientFromHeader({ req }),
    edge,
    fields: [],
    deprecatedFields: [],
    args: argumentList,
  }
}
