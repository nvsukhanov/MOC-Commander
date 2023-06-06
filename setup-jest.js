const {pathsToModuleNameMapper} = require('ts-jest');
const {paths} = require('./tsconfig.json').compilerOptions;

const ES_MODULES = ['@angular', '@ngrx', '@nvsukhanov', 'reflect-metadata'];

// eslint-disable-next-line no-undef
globalThis.ngJest = {
    skipNgcc: false,
    tsconfig: 'tsconfig.spec.json',
};

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
    preset: 'jest-preset-angular',
    // globalSetup: 'jest-preset-angular/global-setup',
    moduleNameMapper: pathsToModuleNameMapper(paths, {prefix: '<rootDir>'}),
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
    },
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!.*\\.mjs$|${ES_MODULES.join('|')})`,
    ],
    // setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
