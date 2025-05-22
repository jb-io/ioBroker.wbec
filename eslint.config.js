module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                // Node.js Globals
                'process': 'readonly',
                'require': 'readonly',
                'module': 'writable',
                '__dirname': 'readonly',
                '__filename': 'readonly',
                // Mocha Globals
                'describe': 'readonly',
                'it': 'readonly',
                'before': 'readonly',
                'after': 'readonly',
                'beforeEach': 'readonly',
                'afterEach': 'readonly',
            },
            parserOptions: {
                ecmaVersion: 2022,
            },
        },
        files: ['**/*.ts', '**/*.js'],
        ignores: [
            'build/**',
            '**/.eslintrc.js',
            'admin/words.js'
        ],
        rules: {
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1
                }
            ],
            'no-console': 'off',
            'no-unused-vars': [
                'error',
                {
                    'ignoreRestSiblings': true,
                    'argsIgnorePattern': '^_'
                }
            ],
            'no-var': 'error',
            'no-trailing-spaces': 'error',
            'prefer-const': 'error',
            'quotes': [
                'error',
                'single',
                {
                    'avoidEscape': true,
                    'allowTemplateLiterals': true
                }
            ],
            'semi': [
                'error',
                'always'
            ]
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
    },
    {
        files: ['**/adapter-config.d.ts'],
        rules: {
            'no-unused-vars': 'off'
        }
    }
];
