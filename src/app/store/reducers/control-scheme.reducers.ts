import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEMES_ENTITY_ADAPTER } from '../entity-adapters';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { BindingForm } from '../../control-schemes/edit';
import { ControlSchemeBinding } from '../i-state';
import { HubIoOperationMode } from '../hub-io-operation-mode';

function trimOutputBinding(source: ReturnType<BindingForm['getRawValue']>): ControlSchemeBinding {
    switch (source.output.operationMode) {
        case HubIoOperationMode.Linear:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.Linear,
                    linearConfig: source.output.linearConfig
                }
            };
        case HubIoOperationMode.Servo:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.Servo,
                    servoConfig: source.output.servoConfig
                }
            };
        case HubIoOperationMode.SetAngle:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.SetAngle,
                    setAngleConfig: source.output.setAngleConfig
                }
            };
    }
}

export const CONTROL_SCHEME_REDUCERS = createReducer(
    CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState(),
    on(CONTROL_SCHEME_ACTIONS.create, (
        state,
        { id, name, bindings }
    ) => { // TODO: add return type (and for other reducers too)
        const nextIndex = Math.max(0, ...Object.values(state.entities).map((entity) => entity?.index ?? 0)) + 1;
        return CONTROL_SCHEMES_ENTITY_ADAPTER.addOne({
            id,
            name,
            index: nextIndex,
            bindings: bindings.map((binding) => trimOutputBinding(binding))
        }, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.delete, (
        state,
        { id }
    ) => {
        return CONTROL_SCHEMES_ENTITY_ADAPTER.removeOne(id, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.update, (
        state,
        { id, name, bindings }
    ) => {
        return CONTROL_SCHEMES_ENTITY_ADAPTER.updateOne({
            id,
            changes: {
                name,
                bindings: bindings.map((binding) => trimOutputBinding(binding))
            }
        }, state);
    }),
);
