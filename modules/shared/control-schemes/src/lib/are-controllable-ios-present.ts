import { PortModeName } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, attachedIoModesIdFn, attachedIoPortModeInfoIdFn } from '@app/store';

import { getMatchingBindingTypes } from './io-has-matching-mode-for-op-mode';

export function areControllableIosPresent(
  ios: AttachedIoModel[],
  ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
  portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
): boolean {
  return ios.some((io) => {
    const ioSupportedModes = ioSupportedModesEntities[attachedIoModesIdFn(io)];
    if (!ioSupportedModes) {
      return false;
    }
    const ioOutputModes = ioSupportedModes.portOutputModes;
    const ioOutputPortModeNames = ioOutputModes
      .map((modeId) => {
        const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
        return portModeInfo?.name ?? null;
      })
      .filter((name): name is PortModeName => !!name);
    return getMatchingBindingTypes(ioOutputPortModeNames).length > 0;
  });
}
