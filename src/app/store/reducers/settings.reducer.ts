import { createFeature, createReducer, on } from '@ngrx/store';

import { SettingsModel, UserSelectedTheme } from '../models';
import { SETTINGS_ACTIONS } from '../actions';

export type SettingsState = SettingsModel;

export const SETTINGS_FEATURE = createFeature({
    name: 'settings',
    reducer: createReducer(
        { theme: UserSelectedTheme.System } as SettingsState,
        on(SETTINGS_ACTIONS.setTheme, (state, { theme }) => ({ ...state, theme }))
    )
});
