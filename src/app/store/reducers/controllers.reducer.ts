import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ControllerType } from '@app/shared';

import { CONTROLLERS_ACTIONS } from '../actions';
import { ControllerModel, } from '../models';

export const CONTROLLERS_ENTITY_ADAPTER: EntityAdapter<ControllerModel> = createEntityAdapter<ControllerModel>({
    selectId: (controller) => controller.id,
});

export type ControllersState = EntityState<ControllerModel>;

export function controllerIdFn(
    idArgs: { profileUid: string; controllerType: ControllerType.Gamepad; gamepadOfTypeIndex: number }
        | { profileUid: string; controllerType: ControllerType.Keyboard }
): string {
    switch (idArgs.controllerType) {
        case ControllerType.Keyboard:
            return idArgs.profileUid;
        case ControllerType.Gamepad:
            return `gamepad-${idArgs.profileUid}/${idArgs.gamepadOfTypeIndex}`;
    }
}

export const CONTROLLERS_INITIAL_STATE = CONTROLLERS_ENTITY_ADAPTER.getInitialState();

export const CONTROLLERS_FEATURE = createFeature({
    name: 'controllers',
    reducer: createReducer(
        CONTROLLERS_INITIAL_STATE,
        on(CONTROLLERS_ACTIONS.keyboardDiscovered, (state, action): ControllersState => {
            return CONTROLLERS_ENTITY_ADAPTER.addOne({
                id: controllerIdFn({ profileUid: action.profileUid, controllerType: ControllerType.Keyboard }),
                controllerType: ControllerType.Keyboard,
                profileUid: action.profileUid,
            }, state);
        }),
        on(CONTROLLERS_ACTIONS.gamepadDiscovered, (state, action): ControllersState => {
            return CONTROLLERS_ENTITY_ADAPTER.addOne({
                id: action.id,
                controllerType: ControllerType.Gamepad,
                axesCount: action.axesCount,
                buttonsCount: action.buttonsCount,
                triggerButtonIndices: action.triggerButtonsIndices,
                profileUid: action.profileUid,
                gamepadOfTypeIndex: action.gamepadOfTypeIndex,
            }, state);
        })
    ),
});
