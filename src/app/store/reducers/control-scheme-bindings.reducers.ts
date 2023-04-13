import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEME_BINDING_ADAPTER } from '../entity-adapters';
import { CONTROL_SCHEME_BINDINGS_ACTIONS } from '../actions';

export const CONTROL_SCHEME_BINDINGS_REDUCERS = createReducer(
    CONTROL_SCHEME_BINDING_ADAPTER.getInitialState(),
    on(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputReceived, (state, data) => {
        return CONTROL_SCHEME_BINDING_ADAPTER.upsertOne({
            id: crypto.randomUUID(),
            schemeId: data.schemeId,
            gamepadId: data.gamepadId,
            gamepadInputMethod: data.inputType,
            gamepadAxisId: data.gamepadAxisId,
            gamepadButtonId: data.gamepadButtonId
        }, state);
    })
);
