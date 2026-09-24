/* eslint-disable @typescript-eslint/no-var-requires */

const typescript = require('@typescript-eslint/eslint-plugin')
const parser = require('@typescript-eslint/parser')
const react = require('eslint-plugin-react')
const accessibility = require('eslint-plugin-jsx-a11y')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-ui-tests/**',
      'playwright-report/**',
      'test-results/**',
      '.now/**',
      '.vscode/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'jsx-a11y': accessibility,
      prettier,
    },
    settings: { react: { version: 'detect' } },
    // Preserve the enabled rules from ESLint 6 / typescript-eslint 2.
    // Only renamed rules are mapped; new recommended rules are not adopted.
    rules: {
      'prettier/prettier': ['error'],
      'jsx-a11y/accessible-emoji': ['error'],
      'jsx-a11y/alt-text': ['error'],
      'jsx-a11y/anchor-has-content': ['error'],
      'jsx-a11y/anchor-is-valid': ['error'],
      'jsx-a11y/aria-activedescendant-has-tabindex': ['error'],
      'jsx-a11y/aria-props': ['error'],
      'jsx-a11y/aria-proptypes': ['error'],
      'jsx-a11y/aria-role': ['error'],
      'jsx-a11y/aria-unsupported-elements': ['error'],
      'jsx-a11y/autocomplete-valid': ['error'],
      'jsx-a11y/click-events-have-key-events': ['error'],
      'jsx-a11y/heading-has-content': ['error'],
      'jsx-a11y/html-has-lang': ['error'],
      'jsx-a11y/iframe-has-title': ['error'],
      'jsx-a11y/img-redundant-alt': ['error'],
      'jsx-a11y/interactive-supports-focus': [
        'error',
        {
          tabbable: [
            'button',
            'checkbox',
            'link',
            'searchbox',
            'spinbutton',
            'switch',
            'textbox',
          ],
        },
      ],
      'jsx-a11y/label-has-associated-control': ['error'],
      'jsx-a11y/media-has-caption': ['error'],
      'jsx-a11y/mouse-events-have-key-events': ['error'],
      'jsx-a11y/no-access-key': ['error'],
      'jsx-a11y/no-autofocus': ['error'],
      'jsx-a11y/no-distracting-elements': ['error'],
      'jsx-a11y/no-interactive-element-to-noninteractive-role': [
        'error',
        {
          tr: ['none', 'presentation'],
        },
      ],
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onError',
            'onLoad',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
          alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
          body: ['onError', 'onLoad'],
          dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
          iframe: ['onError', 'onLoad'],
          img: ['onError', 'onLoad'],
        },
      ],
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        {
          ul: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          ol: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
          table: ['grid'],
          td: ['gridcell'],
        },
      ],
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        {
          tags: [],
          roles: ['tabpanel'],
          allowExpressionValues: true,
        },
      ],
      'jsx-a11y/no-onchange': ['error'],
      'jsx-a11y/no-redundant-roles': ['error'],
      'jsx-a11y/no-static-element-interactions': [
        'error',
        {
          allowExpressionValues: true,
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],
      'jsx-a11y/role-has-required-aria-props': ['error'],
      'jsx-a11y/role-supports-aria-props': ['error'],
      'jsx-a11y/scope': ['error'],
      'jsx-a11y/tabindex-no-positive': ['error'],
      '@typescript-eslint/adjacent-overload-signatures': ['error'],
      '@typescript-eslint/consistent-type-assertions': ['error'],
      '@typescript-eslint/no-array-constructor': ['error'],
      '@typescript-eslint/no-empty-function': ['error'],
      '@typescript-eslint/no-empty-interface': ['error'],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-inferrable-types': ['error'],
      '@typescript-eslint/no-misused-new': ['error'],
      '@typescript-eslint/no-namespace': ['error'],
      '@typescript-eslint/no-non-null-assertion': ['warn'],
      '@typescript-eslint/no-this-alias': ['error'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-var-requires': ['error'],
      '@typescript-eslint/prefer-namespace-keyword': ['error'],
      '@typescript-eslint/triple-slash-reference': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'prefer-rest-params': ['error'],
      'prefer-spread': ['error'],
      'react/display-name': [2],
      'react/jsx-key': [2],
      'react/jsx-no-comment-textnodes': [2],
      'react/jsx-no-duplicate-props': [2],
      'react/jsx-no-target-blank': [2],
      'react/jsx-no-undef': [2],
      'react/jsx-uses-react': [2],
      'react/jsx-uses-vars': [2],
      'react/no-children-prop': [2],
      'react/no-danger-with-children': [2],
      'react/no-deprecated': [2],
      'react/no-direct-mutation-state': [2],
      'react/no-find-dom-node': [2],
      'react/no-is-mounted': [2],
      'react/no-render-return-value': [2],
      'react/no-string-refs': [2],
      'react/no-unescaped-entities': [2],
      'react/no-unknown-property': [2],
      'react/prop-types': [2],
      'react/react-in-jsx-scope': [2],
      'react/require-render-return': [2],
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            String: {
              message: 'Use string instead',
              fixWith: 'string',
            },
            Boolean: {
              message: 'Use boolean instead',
              fixWith: 'boolean',
            },
            Number: {
              message: 'Use number instead',
              fixWith: 'number',
            },
            Object: {
              message: 'Use Record<string, any> instead',
              fixWith: 'Record<string, any>',
            },
            Symbol: {
              message: 'Use symbol instead',
              fixWith: 'symbol',
            },
          },
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['class', 'typeAlias', 'typeParameter'],
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
    },
  },
]
