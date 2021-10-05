import { splitFields } from './splitFields'
import { TAG_SEPARATOR, TAG_VALUE_LIMIT } from './types'

describe('splitFields', () => {
  it('creates an object with 1 key', () => {
    // Arrange
    const fields: Array<string> = [
      'account.id',
      'account.email',
      'account.currentOrganization',
      'organization.id',
      'organization.name',
    ]

    // Act
    const result = splitFields(fields)

    // Assert
    expect(Object.keys(result)).toHaveLength(1)
  })

  it('skips __typename fields', () => {
    // Arrange
    const fields: Array<string> = [
      'account.__typename',
      'account.id',
      'account.email',
      'account.currentOrganization',
      'organization.id',
      'organization.name',
    ]

    // Act
    const result = splitFields(fields)

    // Assert
    expect(Object.keys(result)).toHaveLength(1)
    expect(result.fields).toHaveLength(5)
    expect(result.fields).not.toContain<string>('account.__typename')
  })

  it('creates an object with 2 keys', () => {
    // Arrange
    const fields: Array<string> = [
      'account.email',
      'account.currentOrganization',
      'currentOrganization.billing',
      'billing.canAccessEngagement',
      'billing.gateway',
      'gateway.gatewayId',
      'billing.MPBilling',
      'billing.subscriptions',
      'subscriptions.product',
      'subscriptions.plan',
      'billing.OBSubscriptionFields',
      'billing.subscription',
      'subscription.plan',
      'plan.id',
      'plan.name',
      'subscription.quantity',
      'account.organizations',
      'organizations.name',
      'organizations.ChannelsFields',
      'organizations.channels',
      'channels.id',
    ]

    // Act
    const result = splitFields(fields)

    // Assert
    expect(Object.keys(result)).toHaveLength(3)
    Object.values(result).forEach((fields: Array<string>) => {
      expect(fields.join(TAG_SEPARATOR).length).toBeLessThanOrEqual(
        TAG_VALUE_LIMIT,
      )
    })
  })
})
