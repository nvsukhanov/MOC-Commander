import type { Config } from '@jest/types';

const esModules = ['@angular', 'tslib', 'rxjs', 'rxpoweredup'];

const CONFIG: Config.InitialOptions = {
    displayName: 'app',
    preset: './jest.preset.js',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    coverageDirectory: '../../coverage/modules/app',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$'
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
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
    ]
};

export default CONFIG;
