import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { ControlSchemeModel } from './control-scheme.model';
import { CONTROL_SCHEME_ACTIONS } from './control-scheme.actions';
import { trimOutputBinding } from './trim-output-bingings-fn';

export interface ControlSchemeState extends EntityState<ControlSchemeModel> {
    isListening: boolean;
    runningSchemeId: string | null;
}

export const CONTROL_SCHEMES_ENTITY_ADAPTER: EntityAdapter<ControlSchemeModel> = createEntityAdapter<ControlSchemeModel>({
    selectId: (scheme) => scheme.id,
    sortComparer: (a, b) => a.index - b.index
});

export const CONTROL_SCHEMES_INITIAL_STATE = CONTROL_SCHEMES_ENTITY_ADAPTER.getInitialState({
    isListening: false,
    runningSchemeId: null as string | null, // TODO: had to cast bc of seemingly incorrect type inference in ngrx
});

export const CONTROL_SCHEMES_FEATURE = createFeature({
    name: 'controlSchemes',
    reducer: createReducer(
        CONTROL_SCHEMES_INITIAL_STATE,
        on(CONTROL_SCHEME_ACTIONS.create, (state, action): ControlSchemeState => {
            const nextIndex = Math.max(0, ...Object.values(state.entities).map((entity) => entity?.index ?? 0)) + 1;
            return CONTROL_SCHEMES_ENTITY_ADAPTER.addOne({
                id: action.id,
                name: action.name,
                index: nextIndex,
                bindings: action.bindings.map((binding) => trimOutputBinding(binding)),
            }, state);
        }),
        on(CONTROL_SCHEME_ACTIONS.delete, (state, action): ControlSchemeState => CONTROL_SCHEMES_ENTITY_ADAPTER.removeOne(action.id, state)),
        on(CONTROL_SCHEME_ACTIONS.update, (state, action): ControlSchemeState => {
            return CONTROL_SCHEMES_ENTITY_ADAPTER.updateOne({
                id: action.id,
                changes: {
                    name: action.name,
                    bindings: action.bindings.map((binding) => trimOutputBinding(binding)),
                }
            }, state);
        }),
        on(CONTROL_SCHEME_ACTIONS.startScheme, (state, { schemeId }): ControlSchemeState => ({ ...state, runningSchemeId: schemeId })),
        on(CONTROL_SCHEME_ACTIONS.stopScheme, (state): ControlSchemeState => ({ ...state, runningSchemeId: null })),
        on(CONTROL_SCHEME_ACTIONS.startListening, (state): ControlSchemeState => ({ ...state, isListening: true })),
        on(CONTROL_SCHEME_ACTIONS.stopListening, (state): ControlSchemeState => ({ ...state, isListening: false }))
    )
});
