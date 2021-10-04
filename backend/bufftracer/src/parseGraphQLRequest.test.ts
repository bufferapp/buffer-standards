import { getFragmentASTs, parseGraphQLRequest } from './parseGraphQLRequest'
import { GraphQlRequest } from './types'
import { parse } from 'graphql'
import { HEADER_CLIENT_ID } from './getClientFromHeader'

export const query = `query accountGetAccount {
  account(id: "some-id") {
    email
    currentOrganization {
      billing {
        canAccessEngagement
        gateway {
          gatewayId
        }
        ... on MPBilling {
          subscriptions {
            product
            plan
          }
        }
        ...OBSubscriptionFields
      }
    }
    organizations {
      name
      ...ChannelsFields
    }
  }
}

fragment OBSubscriptionFields on OBBilling {
  subscription {
    plan {
      id
      name
    }
    quantity
  }
}

fragment ChannelsFields on AccountOrganization {
  channels(product: engage) {
    id
  }
}`

describe('getFragmentASTs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns 2 fragment definition nodes', () => {
    // Arrange
    const ast = parse(query)

    // Act
    const result = getFragmentASTs({ ast })

    // Assert
    expect(Object.keys(result)).toHaveLength(2)
  })
})

describe('parseGraphQLRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns fields and arguments for nodes, inline fragments and spread fragments', () => {
    // Arrange
    const req: GraphQlRequest = {
      headers: {
        [HEADER_CLIENT_ID]: 'webapp-account',
      },
      params: {},
      body: {
        query,
      },
    }

    // Act
    const result = parseGraphQLRequest({ req })

    // Assert
    expect(result).not.toBeNull()
    expect(result).toMatchSnapshot()
  })
})
