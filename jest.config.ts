import type { Config } from '@jest/types';
import nxPreset from '@nx/jest/preset';

const esModules = ['@angular', 'tslib', 'rxjs', 'rxpoweredup'];

const CONFIG: Config.InitialOptions = {
    displayName: 'app',
    ...nxPreset,
    setupFilesAfterEnv: ['./src/test-setup.ts'],
    coverageDirectory: '../../coverage/modules/app',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: './tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
                useESM: true
            },
        ],
    },
    maxWorkers: 1,
    transformIgnorePatterns: [
        `node_modules/(?!.*\\.mjs$|${esModules.join('|')})`
    ],
    snapshotSerializers: [
        'jest-preset-angular/build/serializers/no-ng-attributes',
        'jest-preset-angular/build/serializers/ng-snapshot',
        'jest-preset-angular/build/serializers/html-comment',
    ],
};

export default CONFIG;
