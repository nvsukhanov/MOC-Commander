import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ControllerInputType } from '@app/shared';

import { CONTROLLER_INPUT_ACTIONS } from '../actions';
import { ControllerInputModel } from '../models';

export interface ControllerInputState extends EntityState<ControllerInputModel> {
    listenersCount: number;
}

export const CONTROLLER_INPUT_ENTITY_ADAPTER: EntityAdapter<ControllerInputModel> = createEntityAdapter<ControllerInputModel>({
    selectId: (input) => controllerInputIdFn(input),
    sortComparer: (a, b) => a.timestamp - b.timestamp
});

export function controllerInputIdFn(
    idArgs: { controllerId: string; inputId: string; inputType: ControllerInputType.Button | ControllerInputType.Axis | ControllerInputType.Trigger } |
        { controllerId: string; inputId: string; inputType: ControllerInputType.ButtonGroup; portId: number | null; buttonId: number | null }
): string {
    switch (idArgs.inputType) {
        case ControllerInputType.Button:
        case ControllerInputType.Axis:
        case ControllerInputType.Trigger:
            return `${idArgs.controllerId}/${idArgs.inputType}/${idArgs.inputId}`;
        case ControllerInputType.ButtonGroup:
            return `${idArgs.controllerId}/${idArgs.inputType}/${idArgs.portId}/${idArgs.buttonId}`;
    }
}

export const CONTROLLER_INPUT_INITIAL_STATE = CONTROLLER_INPUT_ENTITY_ADAPTER.getInitialState({
    listenersCount: 0
});

export const CONTROLLER_INPUT_FEATURE = createFeature({
    name: 'controllerInput',
    reducer: createReducer(
        CONTROLLER_INPUT_INITIAL_STATE,
        on(CONTROLLER_INPUT_ACTIONS.inputReceived, (state, action): ControllerInputState => {
            if (action.inputType === ControllerInputType.ButtonGroup) {
                return CONTROLLER_INPUT_ENTITY_ADAPTER.upsertOne({
                    controllerId: action.controllerId,
                    value: action.value,
                    rawValue: action.rawValue,
                    inputId: action.inputId,
                    inputType: action.inputType,
                    portId: action.portId,
                    buttonId: action.buttonId,
                    timestamp: action.timestamp
                }, state);
            }
            return CONTROLLER_INPUT_ENTITY_ADAPTER.upsertOne({
                controllerId: action.controllerId,
                value: action.value,
                rawValue: action.rawValue,
                inputId: action.inputId,
                inputType: action.inputType,
                timestamp: action.timestamp
            }, state);
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
                const nextState = nextListenersCount === 0
                                  ? CONTROLLER_INPUT_ENTITY_ADAPTER.removeAll(state)
                                  : state;
                return {
                    ...nextState,
                    listenersCount: nextListenersCount
                };
            })
    )
});
