import { GraphQlRequest, RPCRequest } from './types'
import { HEADER_CLIENT_ID } from './getClientFromHeader'
import { isGraphQlRequest, isRPCRequest } from './utils'

describe('isGraphQlRequest & isRPCRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns isGraphQlRequest:true and isRPCRequest:false', () => {
    // Arrange
    const req: GraphQlRequest = {
      headers: {},
      params: {},
      body: {
        query: 'query { account { email } }',
      },
    }

    // Act + Assert
    expect(isGraphQlRequest(req)).toEqual(true)
    expect(isRPCRequest(req)).toEqual(false)
  })

  it('returns isGraphQlRequest:false and isRPCRequest:true - params version', () => {
    // Arrange
    const req: RPCRequest = {
      headers: {
        [HEADER_CLIENT_ID]: 'webapp-account',
      },
      params: {
        method: 'getAccount',
      },
      body: {
        args: JSON.stringify({
          email: 'test@buffer.com',
        }),
      },
    }

    // Act + Assert
    expect(isGraphQlRequest(req)).toEqual(false)
    expect(isRPCRequest(req)).toEqual(true)
  })

  it('returns isGraphQlRequest:false and isRPCRequest:true - body version', () => {
    // Arrange
    const req: RPCRequest = {
      headers: {
        [HEADER_CLIENT_ID]: 'webapp-account',
      },
      params: {},
      body: {
        name: 'getAccount',
        args: JSON.stringify({
          email: 'test@buffer.com',
        }),
      },
    }

    // Act + Assert
    expect(isGraphQlRequest(req)).toEqual(false)
    expect(isRPCRequest(req)).toEqual(true)
  })
})
