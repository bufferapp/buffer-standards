module.exports = {
  extends: [
    "./index.js",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    "typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["node_modules/*", "built/*", "lib/*", "build/*"],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "no-underscore-dangle": "off"
  }
}
