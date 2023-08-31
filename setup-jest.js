const {pathsToModuleNameMapper} = require('ts-jest');
const {paths} = require('./tsconfig.json').compilerOptions;

const ES_MODULES = ['@angular', '@ngrx', 'rxpoweredup', 'reflect-metadata'];

// eslint-disable-next-line no-undef
globalThis.ngJest = {
    skipNgcc: false,
    tsconfig: 'tsconfig.spec.json',
};

module.exports = {
    preset: 'jest-preset-angular',
    moduleNameMapper: pathsToModuleNameMapper(paths, {prefix: '<rootDir>'}),
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
    },
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!.*\\.mjs$|${ES_MODULES.join('|')})`,
    ]
};
