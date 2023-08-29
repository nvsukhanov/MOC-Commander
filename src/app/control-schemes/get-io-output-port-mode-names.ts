import { Dictionary } from '@ngrx/entity';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, attachedIoModesIdFn, attachedIoPortModeInfoIdFn } from '@app/store';

export function getIoOutputPortModeNames(
    io: AttachedIoModel,
    ioModeEntities: Dictionary<AttachedIoModesModel>,
    attachedIoPortModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>
): PortModeName[] {
    const ioModes = ioModeEntities[attachedIoModesIdFn(io)];
    if (!ioModes) {
        return [];
    }
    return ioModes.portOutputModes
                  .map((modeId) => attachedIoPortModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })])
                  .filter((portModeInfo): portModeInfo is AttachedIoPortModeInfoModel => !!portModeInfo)
                  .map((portModeInfo) => portModeInfo.name);
}
