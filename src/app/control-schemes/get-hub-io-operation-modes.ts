import { PortModeName } from '@nvsukhanov/rxpoweredup';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    AttachedIoModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';

import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { getIoOperationModesForControllerInputType } from './get-io-operation-modes-for-controller-input-type';
import { doesIoSupportOperationMode } from './does-io-support-operation-mode';

export function getHubIoOperationModes(
    io: AttachedIoModel,
    supportedModes: ReturnType<typeof ATTACHED_IO_MODES_SELECTORS.selectEntities>,
    portModeData: ReturnType<typeof ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities>,
    inputType: ControllerInputType
): HubIoOperationMode[] {
    const operationModesByInputType = getIoOperationModesForControllerInputType(inputType);

    const ioSupportedOutputModes: number[] = supportedModes[attachedIoModesIdFn(io)]?.portOutputModes ?? [];

    const ioOutputPortModeNames: PortModeName[] = ioSupportedOutputModes.map((modeId) => {
        const portModeId = attachedIoPortModeInfoIdFn({ ...io, modeId });
        return portModeData[portModeId]?.name ?? null;
    }).filter((name) => !!name) as PortModeName[];

    return operationModesByInputType.filter((operationMode) =>
        doesIoSupportOperationMode(operationMode, ioOutputPortModeNames)
    );
}
