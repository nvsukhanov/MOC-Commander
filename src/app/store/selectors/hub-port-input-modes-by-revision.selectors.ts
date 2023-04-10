/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER } from '../entity-adapters';
import { IOType } from '../../lego-hub';
import { IState } from '../i-state';

export const HUB_PORT_INPUT_MODES_BY_REVISION_FEATURE_SELECTOR = createFeatureSelector<IState['hubPortInputModesByRevision']>(
    'hubPortInputModesByRevision'
);

const SELECT_HUB_PORT_INPUT_MODES_BY_REVISIONS_ALL = createSelector(
    HUB_PORT_INPUT_MODES_BY_REVISION_FEATURE_SELECTOR,
    HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER.getSelectors().selectAll
);

export const SELECT_HUB_PORT_INPUT_MODES_BY_REVISIONS = (hardwareRevision: string, softwareRevision: string, ioType: IOType) => createSelector(
    SELECT_HUB_PORT_INPUT_MODES_BY_REVISIONS_ALL,
    (state) => state.find((item) => item.hardwareRevision === hardwareRevision && item.softwareRevision === softwareRevision && item.ioType === ioType)
);
