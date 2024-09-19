// @ts-check

import unusedImports from 'eslint-plugin-unused-imports';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['dist/*'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    prettierConfig,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.mjs', '.prettierrc.cjs', 'commitlint.config.ts'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            'unused-imports': unusedImports,
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
    },
    {
        files: ['**/*.js'],
        ...tseslint.configs.disableTypeChecked,
    },
);
