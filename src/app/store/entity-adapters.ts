/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IOType } from '@nvsukhanov/rxpoweredup';

import { PortCommandTask } from '@app/shared';
import {
    AttachedIO,
    AttachedIOState,
    ControlScheme,
    Controller,
    ControllerInput,
    ControllerSettings,
    HubConfiguration,
    HubConnection,
    HubIoSupportedModes,
    HubVirtualPortConfig,
    PortModeInfo
} from './i-state';
import { ControllerType } from '../plugins';
import { ControllerInputType } from './controller-input-type';

export const HUB_ATTACHED_IOS_ENTITY_ADAPTER: EntityAdapter<AttachedIO> = createEntityAdapter<AttachedIO>({
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
    selectId: (mode) => hubPortModeInfoIdFn(mode),
});

export function hubPortModeInfoIdFn(
    { hardwareRevision, softwareRevision, modeId, ioType }: { hardwareRevision: string, softwareRevision: string, modeId: number, ioType: IOType }
): string {
    return `${hardwareRevision}/${softwareRevision}/${modeId}/${ioType}`;
}

export const HUB_IO_SUPPORTED_MODES_ENTITY_ADAPTER: EntityAdapter<HubIoSupportedModes> = createEntityAdapter<HubIoSupportedModes>({
    selectId: (mode) => hubIOSupportedModesIdFn(mode),
});

export function hubIOSupportedModesIdFn(
    { hardwareRevision, softwareRevision, ioType }: { hardwareRevision: string, softwareRevision: string, ioType: IOType }
): string {
    return `${hardwareRevision}/${softwareRevision}/${ioType}`;
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

export const HUB_ATTACHED_IO_STATE_ENTITY_ADAPTER: EntityAdapter<AttachedIOState> = createEntityAdapter<AttachedIOState>({
    selectId: (io) => hubAttachedIosIdFn(io),
});

export const CONTROLLERS_ENTITY_ADAPTER: EntityAdapter<Controller> = createEntityAdapter<Controller>({
    selectId: (controller) => controllerIdFn(controller),
});

export function controllerIdFn(
    idArgs: { id: string, controllerType: ControllerType.Gamepad, gamepadIndex: number } | { controllerType: ControllerType.Keyboard }
): string {
    if (idArgs.controllerType === ControllerType.Gamepad) {
        return `${idArgs.id}/${idArgs.controllerType}/${idArgs.gamepadIndex}`;
    } else {
        return `keyboard`;
    }
}

export const CONTROLLER_INPUT_ENTITY_ADAPTER: EntityAdapter<ControllerInput> = createEntityAdapter<ControllerInput>({
    selectId: (input) => controllerInputIdFn(input),
});

export function controllerInputIdFn(
    { controllerId, inputId, inputType }: { controllerId: string, inputId: string, inputType: ControllerInputType }
): string {
    return `${controllerId}/${inputType}/${inputId}`;
}

export const HUB_CONNECTIONS_ENTITY_ADAPTER: EntityAdapter<HubConnection> = createEntityAdapter<HubConnection>({
    selectId: (connection) => connection.hubId,
});

export const CONTROLLER_SETTINGS_ENTITY_ADAPTER: EntityAdapter<ControllerSettings> = createEntityAdapter<ControllerSettings>({
    selectId: (settings) => settings.controllerId,
});

export const HUB_VIRTUAL_PORT_CONFIGS_ENTITY_ADAPTER: EntityAdapter<HubVirtualPortConfig> = createEntityAdapter<HubVirtualPortConfig>({
    selectId: (config) => hubVirtualPortConfigIdFn(config),
});

export function hubVirtualPortConfigIdFn(
    { hubId, portIdA, portIdB }: { hubId: string, portIdA: number, portIdB: number }
): string {
    return `${hubId}/${portIdA}/${portIdB}`;
}
