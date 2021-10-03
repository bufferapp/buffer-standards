import { RPCRequest } from './types'
import {
  HEADER_CLIENT_ID,
  HEADER_CLIENT_UNKNOWN,
  getClientFromHeader,
} from './getClientFromHeader'

describe('getClientFromHeader', () => {
  it('returns a default value', () => {
    // Arrange
    const req: RPCRequest = {
      headers: {},
      params: {},
      body: {
        name: 'getAccount',
        args: JSON.stringify({
          email: 'test@buffer.com',
        }),
      },
    }

    // Act
    const result = getClientFromHeader({ req })

    // Assert
    expect(result).toEqual(HEADER_CLIENT_UNKNOWN)
  })

  it('returns the client id from the headers', () => {
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

    // Act
    const result = getClientFromHeader({ req })

    // Assert
    expect(result).toEqual('webapp-account')
  })
})
