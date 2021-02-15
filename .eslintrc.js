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
        'react/jsx-tag-spacing': [ 1, { 'beforeSelfClosing': 'always' } ],  // warn: <Component/>   ok: <Component />
        'react/jsx-curly-brace-presence': [1, { 'props': 'never', 'children': 'ignore' }],
        'semi': 1,      // Always warn on missing semicolon ;
        'object-curly-spacing': [1, 'always'],       // Always warn on missing spaces inside object / destruct literal,
        'quotes': ['error', 'single'],       //
        'space-in-parens': ['error', 'never'],
        'keyword-spacing': ['error', { before: true, after: true }],
        'no-multi-spaces': 'error',
        'no-var': 'error',
        'prefer-const': ['warn', { destructuring: 'all' }],
        'comma-spacing': 'error',
        'no-trailing-spaces': "error",
    }
}