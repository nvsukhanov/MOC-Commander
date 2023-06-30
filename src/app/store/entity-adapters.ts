/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { PortCommandTask } from '@app/shared';
import { AttachedIo, AttachedIoProps, ControlScheme, HubConfiguration, HubIoSupportedModes, HubStats, PortModeInfo, } from './i-state';

export const HUB_ATTACHED_IOS_ENTITY_ADAPTER: EntityAdapter<AttachedIo> = createEntityAdapter<AttachedIo>({
    selectId: (io) => hubAttachedIosIdFn(io),
    sortComparer: (a, b) => a.portId - b.portId
});

export function hubAttachedIosIdFn(
    { hubId, portId }: { hubId: string, portId: number }
) {
    return `${hubId}/${portId}`;
}

export const HUBS_ENTITY_ADAPTER: EntityAdapter<HubConfiguration> = createEntityAdapter<HubConfiguration>({
    selectId: (hub) => hub.hubId,
    sortComparer: (a, b) => a.hubId.localeCompare(b.hubId)
});

export const HUB_PORT_MODE_INFO: EntityAdapter<PortModeInfo> = createEntityAdapter<PortModeInfo>({
    selectId: (mode) => mode.id,
});

export function hubPortModeInfoIdFn(
    { io, modeId }: { io: AttachedIo, modeId: number }
): string {
    return `${io.hardwareRevision}/${io.softwareRevision}/${io.ioType}/${modeId}`;
}

export const HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER: EntityAdapter<HubIoSupportedModes> = createEntityAdapter<HubIoSupportedModes>({
    selectId: (mode) => mode.id,
});

export function hubIoSupportedModesIdFn(
    io: AttachedIo
): string {
    return `${io.hardwareRevision}/${io.softwareRevision}/${io.ioType}`;
}

export const CONTROL_SCHEMES_ENTITY_ADAPTER: EntityAdapter<ControlScheme> = createEntityAdapter<ControlScheme>({
    selectId: (scheme) => scheme.id,
    sortComparer: (a, b) => a.index - b.index
});

export const LAST_EXECUTED_TASKS_ENTITY_ADAPTER: EntityAdapter<PortCommandTask> = createEntityAdapter<PortCommandTask>({
    selectId: (task) => lastExecutedTaskIdFn(task),
});

export function lastExecutedTaskIdFn(
    { hubId, portId }: { hubId: string, portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER: EntityAdapter<AttachedIoProps> = createEntityAdapter<AttachedIoProps>({
    selectId: (io) => hubAttachedIosIdFn(io),
});

export const HUB_STATS_ENTITY_ADAPTER: EntityAdapter<HubStats> = createEntityAdapter<HubStats>({
    selectId: (stats) => stats.hubId,
});
