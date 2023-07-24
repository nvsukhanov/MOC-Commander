import { SETTINGS_FEATURE } from '../reducers';

export const SETTINGS_SELECTORS = {
    theme: SETTINGS_FEATURE.selectTheme
} as const;
