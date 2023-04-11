/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER } from '../entity-adapters';
import { IOType } from '../../lego-hub';
import { IState } from '../i-state';

const HUB_IO_OUTPUT_MODES_FEATURE_SELECTOR = createFeatureSelector<IState['hubIOOutputModes']>(
    'hubPortInputModesByRevision'
);

const HUB_IO_OUTPUT_MODES_ADAPTER_SELECTORS = HUB_IO_OUTPUT_MODES_ENTITY_ADAPTER.getSelectors();

const SELECT_HUB_IO_OUTPUT_MODES = createSelector(
    HUB_IO_OUTPUT_MODES_FEATURE_SELECTOR,
    HUB_IO_OUTPUT_MODES_ADAPTER_SELECTORS.selectAll
);

export const HUB_IO_OUTPUT_MODES_SELECTORS = {
    selectHubPortInputModesByRevisions: (hardwareRevision: string, softwareRevision: string, ioType: IOType) => createSelector(
        SELECT_HUB_IO_OUTPUT_MODES,
        (state) => state.find((item) => item.hardwareRevision === hardwareRevision && item.softwareRevision === softwareRevision && item.ioType === ioType)
    )
} as const;
