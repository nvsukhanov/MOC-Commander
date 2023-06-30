/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER, hubIoSupportedModesIdFn } from '../entity-adapters';
import { AttachedIo, IState } from '../i-state';

const HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR = createFeatureSelector<IState['hubIoSupportedModes']>('hubIoSupportedModes');

const HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS = HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getSelectors();

export const HUB_IO_SUPPORTED_MODES_SELECTORS = {
    selectIOoSupportedModesList: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectAll
    ),
    selectIoSupportedModesEntities: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectEntities
    ),
    selectIoPortModes: (io: AttachedIo) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOoSupportedModesList,
        (state) => {
            return state.find(
                (item) => item.id === hubIoSupportedModesIdFn(io)
            ) ?? null;
        }
    ),
    hasCachedIoPortModes: (io: AttachedIo) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIoPortModes(io),
        (state) => state !== null
    )
} as const;
