import { createFeature, createReducer, on } from '@ngrx/store';

import { GamepadPollingRate, SettingsModel, UserSelectedTheme } from '../models';
import { SETTINGS_ACTIONS } from '../actions';

const DEFAULT_STATE: SettingsState = {
    appTheme: UserSelectedTheme.System,
    useLinuxCompat: false,
    language: null,
    gamepadPollingRate: GamepadPollingRate.Default
};

export type SettingsState = SettingsModel;

export const SETTINGS_FEATURE = createFeature({
    name: 'settings',
    reducer: createReducer(
        DEFAULT_STATE,
        on(SETTINGS_ACTIONS.setTheme, (state, { appTheme }): SettingsState => ({ ...state, appTheme })),
        on(SETTINGS_ACTIONS.setLanguage, (state, { language }): SettingsState => ({ ...state, language })),
        on(SETTINGS_ACTIONS.setLinuxCompat, (state, { useLinuxCompat }): SettingsState => ({ ...state, useLinuxCompat })),
        on(SETTINGS_ACTIONS.setGamepadPollingRate, (state, { gamepadPollingRate }): SettingsState => ({ ...state, gamepadPollingRate })),
    )
});
