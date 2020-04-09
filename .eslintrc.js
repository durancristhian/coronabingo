module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
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