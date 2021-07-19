module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
}
