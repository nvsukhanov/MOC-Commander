import { INITIAL_STATE } from '../initial-state';
import { createReducer, on } from '@ngrx/store';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLERS_ACTIONS } from '../actions';
import { CONTROLLER_INPUT_ENTITY_ADAPTER, controllerInputIdFn } from '../entity-adapters';

export const CONTROLLER_INPUT_REDUCERS = createReducer(
    INITIAL_STATE.controllerInput,
    on(CONTROLLER_INPUT_ACTIONS.inputReceived, (state, action) => {
        if (action.value !== 0) {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.addOne({
                controllerId: action.controllerId,
                value: action.value,
                inputId: action.inputId,
                inputType: action.inputType
            }, state);
        } else {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.removeOne(controllerInputIdFn(action), state);
        }
    }),
    on(CONTROLLERS_ACTIONS.disconnected, (state, action) => {
        return CONTROLLER_INPUT_ENTITY_ADAPTER.removeMany((v) => v.controllerId === action.id, state);
    }),
    on(CONTROLLER_INPUT_ACTIONS.inputCaptureReleased, (state) => {
        return CONTROLLER_INPUT_ENTITY_ADAPTER.removeAll(state);
    })
);
