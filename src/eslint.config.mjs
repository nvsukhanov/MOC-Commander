import {defineConfig} from 'eslint/config';

import rootConfig from '../eslint.config.mjs';

export default defineConfig([
    ...rootConfig,
    {
        '@angular-eslint/directive-selector': [
            'error',
            {
                type: 'attribute',
                prefix: 'app',
                style: 'camelCase'
            }
        ],
        '@angular-eslint/component-selector': [
            'error',
            {
                type: 'element',
                prefix: 'app',
                style: 'kebab-case'
            }
        ],
    }
]);
