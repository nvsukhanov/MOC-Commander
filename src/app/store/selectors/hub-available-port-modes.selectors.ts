import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';
import { HUB_PORT_MODE_INFO, hubPortModeInfoIdFn } from '../entity-adapters';
import { IOType } from '../../lego-hub';

const SELECT_HUB_AVAILABLE_PORT_MODES_FEATURE = createFeatureSelector<IState['hubPortModeInfo']>('hubAvailablePortModes');

const SELECT_HUB_AVAILABLE_PORT_MODES_ENTITIES = createSelector(
    SELECT_HUB_AVAILABLE_PORT_MODES_FEATURE,
    HUB_PORT_MODE_INFO.getSelectors().selectEntities
);

export const SELECT_PORT_MODE = (hardwareRevision: string, softwareRevision: string, modeId: number, ioType: IOType) => createSelector(
    SELECT_HUB_AVAILABLE_PORT_MODES_ENTITIES,
    (state) => state[hubPortModeInfoIdFn(hardwareRevision, softwareRevision, modeId, ioType)]
);
