module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended'
    ],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    /*      0 = off     1 = warn        2 = error     */
    /**
     * Set up hot keys for EsLint:
     * https://stackoverflow.com/questions/41735890/how-to-make-webstorm-format-code-according-to-eslint
     * */
    rules: {
        'no-console': 0,        // Allows calls to methods of the console object.
        'react/prop-types': 0,      // Disabled checking of prop-types
        'react/jsx-curly-spacing': [1, { when: 'always', children: true }],       // warn: <App {...props} />   ok: <App { ...props } />    warn: <App>{children}</App>     ok: <App>{ children }</App>
        'react/jsx-key': 1,     // Always warn on missing jsx-key inside iterator functions
        'react/jsx-tag-spacing': [ 1, { beforeSelfClosing: 'always' } ],  // warn: <Component/>   ok: <Component />
        'react/jsx-curly-brace-presence': [1, { props: 'never', children: 'ignore' }],
        'react/jsx-equals-spacing': [1, 'never'],
        'semi': 1,      // Always warn on missing semicolon ;
        'object-curly-spacing': [1, 'always'],       // Always warn on missing spaces inside object / destruct literal,
        'curly': 2,
        'brace-style': ['error', '1tbs'],
        'quotes': ['error', 'single'],       //
        'space-in-parens': ['error', 'never'],
        'keyword-spacing': ['error', { before: true, after: true }],
        'no-multi-spaces': 'error',
        'no-var': 'error',
        'prefer-const': ['warn', { destructuring: 'all' }],
        'comma-spacing': 'error',
        'no-trailing-spaces': "error",
        'indent': ['warn', 4, { SwitchCase: 1 }],
        'key-spacing': ['warn', { mode: 'minimum' }],
        'jsx-quotes': ['warn', 'prefer-double'],
        'no-else-return': 'error',
        'eol-last': 'warn',
        'no-unneeded-ternary': 'error',
        'space-before-blocks': ['warn', 'always'],
        'arrow-spacing': 'warn',
        'comma-dangle': ['warn', 'always-multiline'],
        'react/jsx-wrap-multilines': [
            'warn',
            {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
            },
        ],
    },
    overrides: [
        {
            files: ['src/**/*.ts', 'src/**/*.tsx'],
            env: { 'browser': true, 'es6': true, 'node': true },
            parser: '@typescript-eslint/parser',
            plugins: ['react', '@typescript-eslint'],
            extends: [
                'eslint:recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
                'plugin:jest/recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                ecmaVersion: 2018,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            rules: {
                'arrow-body-style': ['error', 'as-needed'],
                'no-console': 0, // Allows calls to methods of the console object.
                'react/prop-types': 0, // Disabled checking of prop-types
                'react/jsx-key': 1, // Always warn on missing jsx-key inside iterator functions
                'react/jsx-curly-brace-presence': [1, { props: 'never', children: 'ignore' }],
                '@typescript-eslint/explicit-module-boundary-types': 0,
                '@typescript-eslint/no-explicit-any': 0,
                'react/jsx-curly-spacing': [1, { when: 'never', children: true }],       // warn: <App { ...props } />   ok: <App {...props} />    warn: <App>{ children }</App>     ok: <App>{children}</App>
                'react/jsx-tag-spacing': [ 1, { beforeSelfClosing: 'always' } ],  // warn: <Component/>   ok: <Component />
                'react/jsx-equals-spacing': [1, 'never'],
                'semi': 'off',
                '@typescript-eslint/semi': 2, // Always warn on missing semicolon ;
                'object-curly-spacing': [1, 'always'],       // Always warn on missing spaces inside object / destruct literal,
                'curly': 2,
                "brace-style": 'off',
                '@typescript-eslint/brace-style': ['error', '1tbs'],
                'quotes': 'off',
                '@typescript-eslint/quotes': ['error', 'single'],
                'space-in-parens': ['error', 'never'],
                'keyword-spacing': 'off',
                '@typescript-eslint/keyword-spacing': ['error', { before: true, after: true }],
                'no-multi-spaces': 'error',
                'no-var': 'error',
                'prefer-const': ['warn', { destructuring: 'all' }],
                'comma-spacing': "off",
                '@typescript-eslint/comma-spacing': ['error'],
                'no-trailing-spaces': "error",
                'indent': 'off',
                '@typescript-eslint/indent': ['warn', 4, { SwitchCase: 1 }],
                'key-spacing': ['warn', { mode: 'minimum' }],
                'jsx-quotes': ['warn', 'prefer-double'],
                'no-else-return': 'error',
                'eol-last': 'warn',
                'no-unneeded-ternary': 'error',
                'space-before-blocks': ['warn', 'always'],
                'arrow-spacing': 'warn',
                '@typescript-eslint/member-delimiter-style': [
                    'warn',
                    {
                        "multiline": {
                            "delimiter": "semi",
                            "requireLast": true,
                        },
                        "singleline": {
                            "delimiter": "semi",
                            "requireLast": true,
                        },
                    }
                ],
                '@typescript-eslint/type-annotation-spacing': ['warn', {
                    after: true,
                    before: false,
                    overrides: {
                        arrow: { before: true, after: true },
                    },
                }],
                'comma-dangle': 'off',
                '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
                'react/jsx-wrap-multilines': [
                    'warn',
                    {
                        declaration: 'parens-new-line',
                        assignment: 'parens-new-line',
                        return: 'parens-new-line',
                        arrow: 'parens-new-line',
                        condition: 'parens-new-line',
                        logical: 'parens-new-line',
                    },
                ],
                'space-infix-ops': 'off',
                '@typescript-eslint/space-infix-ops': ['error'],
                '@typescript-eslint/no-shadow': 1,
                '@typescript-eslint/no-duplicate-imports': 1,
                '@typescript-eslint/prefer-optional-chain': 1,
            },
            settings: {
                react: {
                    version: 'detect',
                }
            },
        },
    ],
}