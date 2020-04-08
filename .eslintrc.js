module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        "@typescript-eslint/ban-ts-ignore": "off"
    },
    settings: {
        react: {
            version: "detect"
        },
        settings: {
            "import/resolver": {
                typescript: {}
            },
        }
    }
};