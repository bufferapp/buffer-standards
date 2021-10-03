import { tagSpanTrace } from './tagSpanTrace'
import { HEADER_CLIENT_ID } from './getClientFromHeader'
import { GraphQlRequest, RPCRequest } from './types'
import { Span } from 'dd-trace'
import { parseGraphQLRequest } from './parseGraphQLRequest'
import { mocked } from 'ts-jest/utils'

jest.mock('./parseGraphQLRequest')

describe('tagSpanTrace', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const req: GraphQlRequest = {
    headers: {
      [HEADER_CLIENT_ID]: 'webapp-account',
    },
    params: {},
    body: {
      query: 'query account { email }',
    },
  }

  const errorCallback = jest.fn((e: Error): void => {
    console.log(e)
  })

  const mockedSpan = {
    setTag: jest.fn(),
  } as unknown as Span

  it('returns FALSE on empty span', () => {
    // Arrange
    const span = undefined

    // Act
    const result = tagSpanTrace(span, req, errorCallback)

    // Assert
    expect(result).toBeFalsy()
  })

  it('returns FALSE on empty metadata', () => {
    // Arrange
    const span = mockedSpan
    mocked(parseGraphQLRequest).mockReturnValue(null)

    // Act
    const result = tagSpanTrace(span, req, errorCallback)

    // Assert
    expect(result).toBeFalsy()
    expect(mockedSpan.setTag).not.toHaveBeenCalled()
  })

  it('calls span.setTag and returns TRUE when metadata are generated from request', () => {
    // Arrange
    const span = mockedSpan
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
    const result = tagSpanTrace(span, req, errorCallback)

    // Assert
    expect(result).toBeTruthy()
    expect(mockedSpan.setTag).toHaveBeenCalledTimes(2)
  })

  it('calls the error callback on error', () => {
    // Arrange
    const span = mockedSpan
    mocked(parseGraphQLRequest).mockImplementation(() => {
      throw new Error('Test error')
    })

    // Act
    const result = tagSpanTrace(span, req, errorCallback)

    // Assert
    expect(result).toBeFalsy()
    expect(mockedSpan.setTag).not.toHaveBeenCalled()
    expect(errorCallback).toHaveBeenCalled()
  })
})
