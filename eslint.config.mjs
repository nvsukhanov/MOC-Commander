import nx from '@nx/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import myCommonRules from '@nvsukhanov/eslint-config-common';
import angularEslint from '@angular-eslint/eslint-plugin';
import ngrxEslint from '@ngrx/eslint-plugin';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      '@nx': nx,
      '@stylistic': stylistic,
      '@ngrx': ngrxEslint,
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
  },
  {
    languageOptions: {
      parser: typescriptEslint.parser,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    languageOptions: {
      parser: typescriptEslint.parser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.base.json'],
        },

        node: {
          project: ['./tsconfig.base.json'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/extensions': ['.ts'],
    },
    rules: {
      'import/order': [
        'error',
        {
          'groups': [['external', 'internal']],

          'pathGroups': [
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
          ],

          'newlines-between': 'always',
          'distinctGroup': false,
        },
      ],
    },
  },
  ...compat.config(ngrxEslint.configs.all),
  ...compat.config(angularEslint.configs.all),
  {
    rules: {
      '@angular-eslint/use-injectable-provided-in': ['off'],
      '@angular-eslint/prefer-signals': ['off'],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@ngrx/prefix-selectors-with-select': 'off',
      'import/order': [
        'error',
        {
          'groups': [['external', 'internal']],
          'pathGroups': [
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          'distinctGroup': false,
        },
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:store',
                'scope:page',
                'scope:shared-misc',
                'scope:shared-components',
                'scope:shared-feature',
                'scope:i18n',
                'scope:controller-profiles',
              ],
            },
            {
              sourceTag: 'scope:store',
              onlyDependOnLibsWithTags: [
                'scope:shared-misc',
                'scope:shared-components',
                'scope:i18n',
                'scope:controller-profiles',
              ],
            },
            {
              sourceTag: 'scope:shared-components',
              onlyDependOnLibsWithTags: ['scope:shared-misc', 'scope:i18n'],
            },
            {
              sourceTag: 'scope:shared-feature',
              onlyDependOnLibsWithTags: [
                'scope:store',
                'scope:shared-misc',
                'scope:i18n',
                'scope:shared-components',
                'scope:controller-profiles',
              ],
            },
            {
              sourceTag: 'scope:i18n',
              onlyDependOnLibsWithTags: ['scope:shared-misc'],
            },
            {
              sourceTag: 'scope:controller-profiles',
              onlyDependOnLibsWithTags: ['scope:shared-misc', 'scope:i18n'],
            },
            {
              sourceTag: 'scope:page',
              onlyDependOnLibsWithTags: [
                'scope:store',
                'scope:shared-feature',
                'scope:shared-misc',
                'scope:i18n',
                'scope:shared-components',
                'scope:controller-profiles',
              ],
            },
            {
              sourceTag: 'scope:shared-misc',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
  ...myCommonRules,
  {
    rules: {
      '@stylistic/operator-linebreak': ['off'],
    },
  },
];
