import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { CONTROLLERS_ACTIONS, CONTROLLER_INPUT_ACTIONS } from '../actions';
import { CONTROLLER_INPUT_ENTITY_ADAPTER, controllerInputIdFn } from '../entity-adapters';
import { IState } from '../i-state';

export const CONTROLLER_INPUT_REDUCER = createReducer(
    INITIAL_STATE.controllerInput,
    on(CONTROLLER_INPUT_ACTIONS.inputReceived, (state, action): IState['controllerInput'] => {
        if (action.value !== 0) {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.upsertOne({
                controllerId: action.controllerId,
                value: action.value,
                inputId: action.inputId,
                inputType: action.inputType
            }, state);
        } else {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.removeOne(controllerInputIdFn(action), state);
        }
    }),
    on(CONTROLLERS_ACTIONS.disconnected, (state, action): IState['controllerInput'] => {
        return CONTROLLER_INPUT_ENTITY_ADAPTER.removeMany((v) => v.controllerId === action.id, state);
    }),
    on(CONTROLLER_INPUT_ACTIONS.inputCaptureReleased, (state): IState['controllerInput'] => {
        return CONTROLLER_INPUT_ENTITY_ADAPTER.removeAll(state);
    })
);
