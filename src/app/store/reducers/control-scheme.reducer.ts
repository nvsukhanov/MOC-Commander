import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ControlSchemeModel } from '../models';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

export interface ControlSchemeState extends EntityState<ControlSchemeModel> {
    runningSchemeId: string | null;
}

export const CONTROL_SCHEME_ENTITY_ADAPTER = createEntityAdapter({
    selectId: (model: ControlSchemeModel) => model.id,
});

export const CONTROL_SCHEME_FEATURE = createFeature({
    name: 'controlSchemes',
    reducer: createReducer(
        CONTROL_SCHEME_ENTITY_ADAPTER.getInitialState({
            runningSchemeId: null as string | null
        }),
        on(CONTROL_SCHEME_ACTIONS.create, (state, action): ControlSchemeState => {
            return CONTROL_SCHEME_ENTITY_ADAPTER.addOne({
                id: action.scheme.id,
                name: action.scheme.name,
                bindings: action.scheme.bindings,
            }, state);
        }),
        on(CONTROL_SCHEME_ACTIONS.update, (state, action): ControlSchemeState => {
            return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne({
                id: action.scheme.id,
                changes: {
                    name: action.scheme.name,
                    bindings: action.scheme.bindings,
                }
            }, state);
        }),
        on(CONTROL_SCHEME_ACTIONS.startScheme, (state, { schemeId }): ControlSchemeState => ({ ...state, runningSchemeId: schemeId })),
        on(CONTROL_SCHEME_ACTIONS.stopScheme, (state): ControlSchemeState => ({ ...state, runningSchemeId: null })),
        on(CONTROL_SCHEME_ACTIONS.delete, (state, action): ControlSchemeState => CONTROL_SCHEME_ENTITY_ADAPTER.removeOne(action.id, state)),
    ),
});
