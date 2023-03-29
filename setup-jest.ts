import 'jest-preset-angular/setup-jest';
import type { Config } from 'jest';

const config: Config = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: [ '<rootDir>/jest/setup-jest.ts' ],
    globalSetup: 'jest-preset-angular/global-setup',
};
export default config;
