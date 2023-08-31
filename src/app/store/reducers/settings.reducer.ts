import { createFeature, createReducer, on } from '@ngrx/store';

import { SettingsModel, UserSelectedTheme } from '../models';
import { SETTINGS_ACTIONS } from '../actions';
import { Language } from '../../i18n';

const DEFAULT_STATE: SettingsState = {
    theme: UserSelectedTheme.System,
    language: Language.English
};

export type SettingsState = SettingsModel;

export const SETTINGS_FEATURE = createFeature({
    name: 'settings',
    reducer: createReducer(
        DEFAULT_STATE,
        on(SETTINGS_ACTIONS.setTheme, (state, { theme }): SettingsState => ({ ...state, theme })),
        on(SETTINGS_ACTIONS.setLanguage, (state, { language }): SettingsState => ({ ...state, language }))
    )
});
