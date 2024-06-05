module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['unused-imports'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        'no-var': 'error',
        semi: 'error',
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
    },
};
