import { APIMetadataFields, TAG_SEPARATOR, TAG_VALUE_LIMIT } from './types'

export function splitFields(fields: Array<string>): APIMetadataFields {
  const apiMetadatafields: APIMetadataFields = {}
  const keys: Array<keyof APIMetadataFields> = [
    'fields',
    'fields2',
    'fields3',
    'fields4',
    'fields5',
    'fields6',
    'fields7',
    'fields8',
    'fields9',
    'fields10',
    'fields11',
    'fields12',
    'fields13',
    'fields14',
    'fields15',
    'fields16',
    'fields17',
    'fields18',
    'fields19',
    'fields20',
  ]

  let currentKeyIndex = 0
  let currentTagValue: Array<string> = []

  for (const field of fields) {
    // Skip invalid fields
    if (!isValidField(field)) {
      continue
    }

    if (isWithinTagValueLimit(currentTagValue, field) === false) {
      // Let's assign this tag value to the current key and start a new one
      apiMetadatafields[keys[currentKeyIndex]] = currentTagValue
      currentTagValue = []
      currentKeyIndex++
    }
    currentTagValue.push(field)
  }
  // Let's asign the final tag value
  apiMetadatafields[keys[currentKeyIndex]] = currentTagValue
  return apiMetadatafields
}

function isValidField(field: string): boolean {
  return field.indexOf('__typename') === -1
}

function isWithinTagValueLimit(
  currentTagValue: Array<string>,
  field: string,
): boolean {
  // Construct what the tag might be with the new field
  const potentialDatadogTagValue =
    currentTagValue.join(TAG_SEPARATOR) + `${TAG_SEPARATOR}${field}`

  // Check if the length the tag value is within the limit
  return potentialDatadogTagValue.length <= TAG_VALUE_LIMIT
}
