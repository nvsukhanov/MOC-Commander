/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER } from '../entity-adapters';
import { IOType } from '../../lego-hub';
import { IState } from '../i-state';

const HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR = createFeatureSelector<IState['hubIOSupportedModes']>('hubIOSupportedModes');

const HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS = HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER.getSelectors();

export const HUB_IO_SUPPORTED_MODES_SELECTORS = {
    selectOSuppoertedModesList: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectAll
    ),
    selectIOSupportedModesRecord: createSelector(
        HUB_IO_SUPPORTED_MODES_FEATURE_SELECTOR,
        HUB_IO_SUPPORTED_MODES_ADAPTER_SELECTORS.selectEntities
    ),
    selectHubIOOutputModes: (hardwareRevision: string, softwareRevision: string, ioType: IOType) => createSelector(
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectOSuppoertedModesList,
        (state) => state.find((item) => item.hardwareRevision === hardwareRevision && item.softwareRevision === softwareRevision && item.ioType === ioType)
    )
} as const;
