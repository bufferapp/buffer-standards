module.exports = {
    extends: [
        "./index.js",
        "plugin:react/recommended",
        "prettier/react"
    ],
    plugins: [
        "react",
    ],
    env: {
        browser: true,
        es6: true,
        jest: true,
    }
}
