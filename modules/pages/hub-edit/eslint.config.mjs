import {defineConfig} from 'eslint/config';

import baseConfig from '../../../eslint.config.mjs';

export default defineConfig([
    ...baseConfig,
    {
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'page',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'page',
                    style: 'kebab-case'
                }
            ],
        }
    }
]);
