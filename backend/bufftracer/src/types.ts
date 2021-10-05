export const TAG_NAME = 'api'
export const TAG_LIMIT = 200 // This is the character limit including all the characters of the string `key:value`
export const TAG_KEY_LENGTH = `${TAG_NAME}.fields10:`.length // This is the string length of the `key:` part
export const TAG_VALUE_LIMIT = TAG_LIMIT - TAG_KEY_LENGTH // This is the remaining character lenth we can use to set fields value
export const TAG_SEPARATOR = '_' // DD will join array of string using "_" as a separator

// We need several fields properties because DD APM tags are limited to 200 characters including the key and value length:
// This results in tag being cut and incomplete data for us because the tag won't contain all fields being queried
// api.fields:account.id_account.currentorganization_currentorganization.id_currentorganization.isonebufferorganization_currentorganization.name_currentorganization.role_currentorganization.billing_billi
export type APIMetadataFields = {
  fields?: Array<string>
  fields2?: Array<string>
  fields3?: Array<string>
  fields4?: Array<string>
  fields5?: Array<string>
  fields6?: Array<string>
  fields7?: Array<string>
  fields8?: Array<string>
  fields9?: Array<string>
  fields10?: Array<string>
}

export type APIRequestMetadata = {
  name: 'core-api' | string
  type: 'graphql' | 'rpc' | 'rest'
  client: 'buffertools-graphql-playground' | string
  edge: string
  deprecatedFields: Array<string>
  args: Array<string>
} & APIMetadataFields

type Request<P, B> = {
  headers: Record<string, string>
  params: P
  body: B
}
export type GraphQlRequest = Request<Record<string, never>, { query: string }>
export type RPCRequest = Request<
  { method?: string },
  { name?: string; args?: string | Record<string, unknown> }
>
