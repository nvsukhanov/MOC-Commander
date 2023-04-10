/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AttachedIOs, HubConfiguration, HubIoValue, PortInputModesByRevision, PortModeInfo } from './i-state';
import { IOType } from '../lego-hub';

export const HUB_ATTACHED_IOS_ENTITY_ADAPTER: EntityAdapter<AttachedIOs> = createEntityAdapter<AttachedIOs>({
    selectId: (io) => hubAttachedIosIdFn(io.hubId, io.portId),
    sortComparer: (a, b) => a.portId - b.portId
});

export const hubAttachedIosIdFn = (hubId: string, portId: number) => `${hubId}/${portId}`;

export const HUBS_ENTITY_ADAPTER: EntityAdapter<HubConfiguration> = createEntityAdapter<HubConfiguration>({
    selectId: (hub) => hub.hubId,
    sortComparer: (a, b) => a.hubId.localeCompare(b.hubId)
});

export const HUB_IO_DATA_ENTITY_ADAPTER: EntityAdapter<HubIoValue> = createEntityAdapter<HubIoValue>({
    selectId: (io) => hubIODataIdFn(io.hubId, io.portId),
});

export const hubIODataIdFn = (hubId: string, portId: number) => `${hubId}/${portId}`;

export const HUB_PORT_MODE_INFO: EntityAdapter<PortModeInfo> = createEntityAdapter<PortModeInfo>({
    selectId: (mode) => hubPortModeInfoIdFn(mode.hardwareRevision, mode.softwareRevision, mode.modeId, mode.ioType),
});

export const hubPortModeInfoIdFn = (hardwareRevision: string, softwareRevision: string, modeId: number, ioType: IOType): string =>
    `${hardwareRevision}/${softwareRevision}/${modeId}/${ioType}`;

export const HUB_PORT_INPUT_MODES_BY_REVISION_ENTITY_ADAPTER: EntityAdapter<PortInputModesByRevision> = createEntityAdapter<PortInputModesByRevision>({
    selectId: (mode) => portInputModesByRevisionIdFn(mode.hardwareRevision, mode.softwareRevision, mode.ioType),
});

export const portInputModesByRevisionIdFn = (hardwareRevision: string, softwareRevision: string, ioType: IOType) =>
    `${hardwareRevision}/${softwareRevision}/${ioType}`;
