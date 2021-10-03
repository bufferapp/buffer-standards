import { RPCRequest } from './types'
import { parseRPCRequest } from './parseRPCRequest'
import { HEADER_CLIENT_ID } from './getClientFromHeader'

describe('parseRPCRequest', () => {
  it('returns metadata from request with name in body', () => {
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
    const result = parseRPCRequest({ req })

    // Assert
    expect(result).not.toBeNull()
    expect(result).toMatchSnapshot()
  })

  it('returns metadata from request with method in params', () => {
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

    // Act
    const result = parseRPCRequest({ req })

    // Assert
    expect(result).not.toBeNull()
    expect(result).toMatchSnapshot()
  })

  it('returns metadata from request with args as null', () => {
    // Arrange
    const req: RPCRequest = {
      headers: {
        [HEADER_CLIENT_ID]: 'webapp-account',
      },
      params: {
        method: 'getAccount',
      },
      body: {},
    }

    // Act
    const result = parseRPCRequest({ req })

    // Assert
    expect(result).not.toBeNull()
    expect(result).toMatchSnapshot()
  })

  it('returns metadata from request with args as object', () => {
    // Arrange
    const req: RPCRequest = {
      headers: {
        [HEADER_CLIENT_ID]: 'webapp-account',
      },
      params: {
        method: 'getAccount',
      },
      body: {
        args: {
          email: 'test@buffer.com',
        },
      },
    }

    // Act
    const result = parseRPCRequest({ req })

    // Assert
    expect(result).not.toBeNull()
    expect(result).toMatchSnapshot()
  })
})
