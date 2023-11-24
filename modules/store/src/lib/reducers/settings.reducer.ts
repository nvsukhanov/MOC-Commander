import { createFeature, createReducer, on } from '@ngrx/store';
import { Language } from '@app/shared';

import { SettingsModel, UserSelectedTheme } from '../models';
import { SETTINGS_ACTIONS } from '../actions';

const DEFAULT_STATE: SettingsState = {
    appTheme: UserSelectedTheme.System,
    language: Language.English
};

export type SettingsState = SettingsModel;

export const SETTINGS_FEATURE = createFeature({
    name: 'settings',
    reducer: createReducer(
        DEFAULT_STATE,
        on(SETTINGS_ACTIONS.setTheme, (state, { appTheme }): SettingsState => ({ ...state, appTheme })),
        on(SETTINGS_ACTIONS.setLanguage, (state, { language }): SettingsState => ({ ...state, language }))
    )
});
