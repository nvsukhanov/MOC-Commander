const nxPreset = require('@nx/jest/preset').default;
const esModules = ['@angular', 'tslib', 'rxjs', 'rxpoweredup'];

module.exports = {
    ...nxPreset,
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`
    ],
};
