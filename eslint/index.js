module.exports = {
    extends: [
        "standard",
        "eslint:recommended",
        "prettier",
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["prettier", "jest"],
}

