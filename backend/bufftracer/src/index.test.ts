import { initTracer } from './index'
import tracer, { TracerOptions } from 'dd-trace'

jest.mock('dd-trace')

describe('initTracer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does not call tracer.init when DD_ENABLE_TRACING=false', () => {
    // Arrange
    process.env.DD_ENABLE_TRACING = 'false'

    const tracerOptions: TracerOptions = {}
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)
    process.env.DD_ENABLE_TRACING = 'true'

    // Assert
    expect(tracer.init).not.toHaveBeenCalled()
  })

  it('does not call tracer.init when enabled=false is passed to the tracer options', () => {
    // Arrange
    process.env.DD_ENABLE_TRACING = 'true'

    const tracerOptions: TracerOptions = {
      enabled: false,
    }
    const errorCallback = (e: Error): void => {
      console.log(e)
    }

    // Act
    initTracer(tracerOptions, errorCallback)

    // Assert
    expect(tracer.init).not.toHaveBeenCalled()
  })

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
