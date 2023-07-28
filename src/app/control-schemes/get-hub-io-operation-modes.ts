import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, attachedIoModesIdFn, attachedIoPortModeInfoIdFn } from '@app/store';

export function getIoPortModes(
    io: AttachedIoModel,
    supportedModes: Dictionary<AttachedIoModesModel>,
    portModeData: Dictionary<AttachedIoPortModeInfoModel>,
): PortModeName[] {
    const ioSupportedOutputModes: number[] = supportedModes[attachedIoModesIdFn(io)]?.portOutputModes ?? [];

    return ioSupportedOutputModes.map((modeId) => {
        const portModeId = attachedIoPortModeInfoIdFn({ ...io, modeId });
        return portModeData[portModeId]?.name ?? null;
    }).filter((name) => !!name) as PortModeName[];
}
