import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ControlSchemeV2Model } from '../models';
import { CONTROL_SCHEME_V2_ACTIONS } from '../actions';

export interface ControlSchemeV2State extends EntityState<ControlSchemeV2Model> {
    runningSchemeId: string | null;
}

export const CONTROL_SCHEME_V2_ENTITY_ADAPTER = createEntityAdapter({
    selectId: (model: ControlSchemeV2Model) => model.id,
});

export const CONTROL_SCHEME_V2_FEATURE = createFeature({
    name: 'controlSchemesV2',
    reducer: createReducer(
        CONTROL_SCHEME_V2_ENTITY_ADAPTER.getInitialState({
            runningSchemeId: null as string | null
        }),
        on(CONTROL_SCHEME_V2_ACTIONS.create, (state, action): ControlSchemeV2State => {
            return CONTROL_SCHEME_V2_ENTITY_ADAPTER.addOne({
                id: action.scheme.id,
                name: action.scheme.name,
                bindings: action.scheme.bindings,
            }, state);
        }),
        on(CONTROL_SCHEME_V2_ACTIONS.update, (state, action): ControlSchemeV2State => {
            return CONTROL_SCHEME_V2_ENTITY_ADAPTER.updateOne({
                id: action.scheme.id,
                changes: {
                    name: action.scheme.name,
                    bindings: action.scheme.bindings,
                }
            }, state);
        }),
        on(CONTROL_SCHEME_V2_ACTIONS.delete, (state, action): ControlSchemeV2State => CONTROL_SCHEME_V2_ENTITY_ADAPTER.removeOne(action.id, state)),
    ),
});
