/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER, hubIOSupportedModesIdFn } from '../entity-adapters';
import { AttachedIO, IState } from '../i-state';

const HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR = createFeatureSelector<IState['hubIOSupportedModes']>('hubIOSupportedModes');

const HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS = HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getSelectors();

export const HUB_IO_SUPPORTED_MODES_SELECTORS = {
    selectIOSupportedModesList: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectAll
    ),
    selectIOSupportedModesEntities: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectEntities
    ),
    selectIOPortModes: (io: AttachedIO) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesList,
        (state) => {
            return state.find(
                (item) => item.id === hubIOSupportedModesIdFn(io)
            ) ?? null;
        }
    ),
    hasCachedIOPortModes: (io: AttachedIO) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOPortModes(io),
        (state) => state !== null
    )
} as const;
