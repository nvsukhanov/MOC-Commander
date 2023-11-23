/* eslint-disable */
export default {
    displayName: 'shared',
    preset: '../../jest.preset.js',
    setupFilesAfterEnv: ['./src/test-setup.ts'],
    coverageDirectory: '../../coverage/modules/shared',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: './tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
    },
    maxWorkers: 1,
    snapshotSerializers: [
        'jest-preset-angular/build/serializers/no-ng-attributes',
        'jest-preset-angular/build/serializers/ng-snapshot',
        'jest-preset-angular/build/serializers/html-comment',
    ],
};
