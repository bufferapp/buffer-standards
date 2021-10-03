import { initTracer } from './index'
import tracer, { TracerOptions } from 'dd-trace'

jest.mock('dd-trace')

describe('initTracer', () => {
  it('enables logInjection and disabled trackAsyncScope by default', () => {
    // Arrange
    const tracerOptions: TracerOptions = {}
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)

    // Assert
    expect(tracer.init).toHaveBeenCalledWith(
      expect.objectContaining({
        logInjection: true,
        trackAsyncScope: false,
      }),
    )
  })

  it('overides tracer configuration with tracerOptions argument', () => {
    // Arrange
    const tracerOptions: TracerOptions = {
      debug: true,
    }
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)

    // Assert
    expect(tracer.init).toHaveBeenCalledWith(
      expect.objectContaining({
        debug: true,
      }),
    )
  })

  it('uses NODE_ENV if NODE_ENV is present', () => {
    // Arrange
    process.env.APP_STAGE = 'staging'
    process.env.NODE_ENV = 'production'

    const tracerOptions: TracerOptions = {}
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)

    // Assert
    expect(tracer.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: 'production',
      }),
    )
  })

  it('uses APP_STAGE if NODE_ENV is not present', () => {
    // Arrange
    process.env.APP_STAGE = 'staging'
    delete process.env.NODE_ENV

    const tracerOptions: TracerOptions = {}
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)

    // Assert
    expect(tracer.init).toHaveBeenCalledWith(
      expect.objectContaining({
        env: 'staging',
      }),
    )
  })
})