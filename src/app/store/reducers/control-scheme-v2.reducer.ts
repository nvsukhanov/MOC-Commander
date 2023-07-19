import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer } from '@ngrx/store';

import { ControlSchemeV2Model } from '../models';

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
    ),
});
