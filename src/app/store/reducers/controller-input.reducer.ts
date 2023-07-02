import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { CONTROLLERS_ACTIONS, CONTROLLER_INPUT_ACTIONS } from '../actions';
import { ControllerInputModel } from '../models';
import { ControllerInputType } from '@app/shared';

export interface ControllerInputState extends EntityState<ControllerInputModel> {
    listenersCount: number;
}

export const CONTROLLER_INPUT_ENTITY_ADAPTER: EntityAdapter<ControllerInputModel> = createEntityAdapter<ControllerInputModel>({
    selectId: (input) => controllerInputIdFn(input),
});

export function controllerInputIdFn(
    { controllerId, inputId, inputType }: { controllerId: string, inputId: string, inputType: ControllerInputType }
): string {
    return `${controllerId}/${inputType}/${inputId}`;
}

export const CONTROLLER_INPUT_INITIAL_STATE = CONTROLLER_INPUT_ENTITY_ADAPTER.getInitialState({
    listenersCount: 0
});

export const CONTROLLER_INPUT_FEATURE = createFeature({
    name: 'controllerInput',
    reducer: createReducer(
        CONTROLLER_INPUT_INITIAL_STATE,
        on(CONTROLLER_INPUT_ACTIONS.inputReceived, (state, action): ControllerInputState => {
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
        on(CONTROLLERS_ACTIONS.disconnected, (state, action): ControllerInputState => {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.removeMany((v) => v.controllerId === action.id, state);
        }),
        on(CONTROLLER_INPUT_ACTIONS.inputCaptureReleased, (state): ControllerInputState => {
            return CONTROLLER_INPUT_ENTITY_ADAPTER.removeAll(state);
        }),
        on(CONTROLLER_INPUT_ACTIONS.requestInputCapture,
            (state): ControllerInputState => {
                return {
                    ...state,
                    listenersCount: state.listenersCount + 1
                };
            }),
        on(CONTROLLER_INPUT_ACTIONS.releaseInputCapture,
            (state): ControllerInputState => {
                const nextListenersCount = state.listenersCount - 1;
                if (nextListenersCount < 0) {
                    throw new Error('Cannot release input capture when no listeners are registered');
                }
                return {
                    ...state,
                    listenersCount: nextListenersCount < 0 ? 0 : nextListenersCount
                };
            })
    )
});
