import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  modulePathIgnorePatterns: ['node_modules/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.env.ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
}

export default config
