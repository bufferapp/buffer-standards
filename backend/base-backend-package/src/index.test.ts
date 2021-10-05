import { hello } from './index'

describe('hello', () => {
  test('it returns hello with the right name', () => {
    expect(hello('Buffer')).toBe('Hello Buffer')
  })
})
