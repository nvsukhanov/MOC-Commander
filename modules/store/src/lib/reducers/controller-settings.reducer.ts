import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ControllerType } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, CONTROLLER_SETTINGS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { ControllerSettingsModel } from '../models';
import { controllerIdFn } from './controllers.reducer';

export type ControllerSettingsState = EntityState<ControllerSettingsModel>;

export const CONTROLLER_SETTINGS_ENTITY_ADAPTER: EntityAdapter<ControllerSettingsModel> =
  createEntityAdapter<ControllerSettingsModel>({
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
      if (!action.defaultSettings) {
        return state;
      }
      const settingsModel: ControllerSettingsModel = {
        controllerId: action.id,
        ignoreInput: false,
        ...action.defaultSettings,
      };
      return CONTROLLER_SETTINGS_ENTITY_ADAPTER.addOne(settingsModel, state);
    }),
    on(CONTROLLERS_ACTIONS.keyboardDiscovered, (state, action): ControllerSettingsState => {
      if (!action.defaultSettings) {
        return state;
      }
      const settingsModel: ControllerSettingsModel = {
        controllerId: action.profileUid,
        ignoreInput: false,
        ...action.defaultSettings,
      };
      return CONTROLLER_SETTINGS_ENTITY_ADAPTER.addOne(settingsModel, state);
    }),
    on(CONTROLLERS_ACTIONS.hubDiscovered, (state, action): ControllerSettingsState => {
      if (!action.defaultSettings) {
        return state;
      }
      const settingsModel: ControllerSettingsModel = {
        controllerId: controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
        ignoreInput: false,
        ...action.defaultSettings,
      };
      return CONTROLLER_SETTINGS_ENTITY_ADAPTER.addOne(settingsModel, state);
    }),
    on(HUBS_ACTIONS.forgetHub, (state, action): ControllerSettingsState => {
      return CONTROLLER_SETTINGS_ENTITY_ADAPTER.removeOne(action.hubId, state);
    }),
    on(CONTROLLERS_ACTIONS.forgetController, (state, action): ControllerSettingsState => {
      return CONTROLLER_SETTINGS_ENTITY_ADAPTER.removeOne(action.controllerId, state);
    }),
  ),
});
