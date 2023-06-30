import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { CONTROLLERS_ACTIONS } from './controllers.actions';
import { ControllerModel, ControllerType } from './controller-model';

const KEYBOARD_CONTROLLER_ID = 'keyboard';

export type ControllersState = EntityState<ControllerModel>;

export const CONTROLLERS_ENTITY_ADAPTER: EntityAdapter<ControllerModel> = createEntityAdapter<ControllerModel>({
    selectId: (controller) => controllerIdFn(controller),
});

export function controllerIdFn(
    idArgs: { id: string, controllerType: ControllerType.Gamepad, gamepadIndex: number } | { controllerType: ControllerType.Keyboard }
): string {
    if (idArgs.controllerType === ControllerType.Gamepad) {
        return `${idArgs.id}/${idArgs.controllerType}/${idArgs.gamepadIndex}`;
    } else {
        return KEYBOARD_CONTROLLER_ID;
    }
}

export const CONTROLLERS_INITIAL_STATE = CONTROLLERS_ENTITY_ADAPTER.getInitialState();

export const CONTROLLERS_FEATURE = createFeature({
    name: 'controllers',
    reducer: createReducer(
        CONTROLLERS_INITIAL_STATE,
        on(CONTROLLERS_ACTIONS.connected, (state, action): ControllersState => {
            return CONTROLLERS_ENTITY_ADAPTER.addOne(action, state);
        }),
        on(CONTROLLERS_ACTIONS.disconnected, (state, action): ControllersState => {
            return CONTROLLERS_ENTITY_ADAPTER.removeOne(action.id, state);
        }),
    ),
});
