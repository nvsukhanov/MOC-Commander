import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { CONTROLLERS_ACTIONS, CONTROLLER_SETTINGS_ACTIONS } from '../actions';
import { ControllerSettingsModel } from '../models';

export type ControllerSettingsState = EntityState<ControllerSettingsModel>;

export const CONTROLLER_SETTINGS_ENTITY_ADAPTER: EntityAdapter<ControllerSettingsModel> = createEntityAdapter<ControllerSettingsModel>({
    selectId: (settings) => settings.controllerId,
});

export const CONTROLLER_SETTINGS_INITIAL_STATE = CONTROLLER_SETTINGS_ENTITY_ADAPTER.getInitialState();

export const CONTROLLER_SETTINGS_FEATURE = createFeature({
    name: 'controllerSettings',
    reducer: createReducer(
        CONTROLLER_SETTINGS_INITIAL_STATE,
        on(CONTROLLER_SETTINGS_ACTIONS.updateSettings, (state, action): ControllerSettingsState => {
            return CONTROLLER_SETTINGS_ENTITY_ADAPTER.upsertOne(action.settings, state);
        }),
        on(CONTROLLERS_ACTIONS.gamepadDiscovered, (state, action): ControllerSettingsState => {
            const settingsModel: ControllerSettingsModel = {
                controllerId: action.id,
                ...action.settings
            };
            return CONTROLLER_SETTINGS_ENTITY_ADAPTER.addOne(settingsModel, state);
        }),
        on(CONTROLLERS_ACTIONS.keyboardDiscovered, (state, action): ControllerSettingsState => {
            const settingsModel: ControllerSettingsModel = {
                controllerId: action.profileUid,
                ...action.settings
            };
            return CONTROLLER_SETTINGS_ENTITY_ADAPTER.addOne(settingsModel, state);
        })
    ),
});
