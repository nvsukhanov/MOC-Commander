/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IState } from '../i-state';
import { HUB_KEEP_VIRTUAL_PORTS_ENTITY_ADAPTER, hubKeepVirtualPortsIdFn } from '../entity-adapters';

const HUB_KEEP_VIRTUAL_PORTS_FEATURE_SELECTOR = createFeatureSelector<IState['hubKeepVirtualPorts']>('hubKeepVirtualPorts');

const HUB_KEEP_VIRTUAL_PORTS_ENTITY_SELECTORS = HUB_KEEP_VIRTUAL_PORTS_ENTITY_ADAPTER.getSelectors();

export const HUB_KEEP_VIRTUAL_PORTS_SELECTORS = {
    selectEntities: createSelector(
        HUB_KEEP_VIRTUAL_PORTS_FEATURE_SELECTOR,
        HUB_KEEP_VIRTUAL_PORTS_ENTITY_SELECTORS.selectEntities
    ),
    shouldKeepVirtualPort: (q: { hubId: string, portIdA: number, portIdB: number }) => createSelector(
        HUB_KEEP_VIRTUAL_PORTS_SELECTORS.selectEntities,
        (entities): boolean => {
            return !!entities[hubKeepVirtualPortsIdFn(q)];
        }
    )
} as const;
