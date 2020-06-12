module.exports = {
    extends: [
        "./index.js",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint"
    ],
    plugins: [
        "typescript-eslint",
    ],
    parser: "@typescript-eslint/parser",
    ignorePatterns: ["node_modules/*"],
    env: {
        node: true,
        es6: true,
        jest: true,
    }
}
