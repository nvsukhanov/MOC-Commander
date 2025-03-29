import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ControllerType } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { ControllerModel } from '../models';

export const CONTROLLERS_ENTITY_ADAPTER: EntityAdapter<ControllerModel> = createEntityAdapter<ControllerModel>({
  selectId: (controller) => controller.id,
});

export type ControllersState = EntityState<ControllerModel>;

export function controllerIdFn(
  idArgs:
    | { profileUid: string; controllerType: ControllerType.Gamepad; gamepadOfTypeIndex: number }
    | { profileUid: string; controllerType: ControllerType.Keyboard }
    | { hubId: string; controllerType: ControllerType.Hub },
): string {
  switch (idArgs.controllerType) {
    case ControllerType.Keyboard:
      return idArgs.profileUid;
    case ControllerType.Gamepad:
      return `gamepad-${idArgs.profileUid}/${idArgs.gamepadOfTypeIndex}`;
    case ControllerType.Hub:
      return `hub-${idArgs.hubId}`;
  }
}

export const CONTROLLERS_INITIAL_STATE = CONTROLLERS_ENTITY_ADAPTER.getInitialState();

export const CONTROLLERS_FEATURE = createFeature({
  name: 'controllers',
  reducer: createReducer(
    CONTROLLERS_INITIAL_STATE,
    on(CONTROLLERS_ACTIONS.keyboardDiscovered, (state, action): ControllersState => {
      return CONTROLLERS_ENTITY_ADAPTER.addOne(
        {
          id: controllerIdFn({ profileUid: action.profileUid, controllerType: ControllerType.Keyboard }),
          controllerType: ControllerType.Keyboard,
          profileUid: action.profileUid,
        },
        state,
      );
    }),
    on(CONTROLLERS_ACTIONS.gamepadDiscovered, (state, action): ControllersState => {
      return CONTROLLERS_ENTITY_ADAPTER.addOne(
        {
          id: action.id,
          controllerType: ControllerType.Gamepad,
          axesCount: action.axesCount,
          buttonsCount: action.buttonsCount,
          triggerButtonIndices: action.triggerButtonsIndices,
          profileUid: action.profileUid,
          gamepadOfTypeIndex: action.gamepadOfTypeIndex,
        },
        state,
      );
    }),
    on(CONTROLLERS_ACTIONS.hubDiscovered, (state, action): ControllersState => {
      return CONTROLLERS_ENTITY_ADAPTER.addOne(
        {
          id: controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
          controllerType: ControllerType.Hub,
          hubId: action.hubId,
          profileUid: action.profileUid,
        },
        state,
      );
    }),
    on(HUBS_ACTIONS.forgetHub, (state, action): ControllersState => {
      return CONTROLLERS_ENTITY_ADAPTER.removeOne(
        controllerIdFn({ hubId: action.hubId, controllerType: ControllerType.Hub }),
        state,
      );
    }),
    on(CONTROLLERS_ACTIONS.forgetController, (state, action): ControllersState => {
      return CONTROLLERS_ENTITY_ADAPTER.removeOne(action.controllerId, state);
    }),
  ),
});
