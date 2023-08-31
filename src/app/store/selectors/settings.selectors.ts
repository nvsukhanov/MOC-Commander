import { SETTINGS_FEATURE } from '../reducers';

export const SETTINGS_SELECTORS = {
    theme: SETTINGS_FEATURE.selectTheme,
    language: SETTINGS_FEATURE.selectLanguage
} as const;
