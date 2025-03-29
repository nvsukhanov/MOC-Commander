import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel } from '@app/store';

import { getIoOutputPortModeNames } from './get-io-output-port-mode-names';
import { getOperationModesByPortModes } from './get-operation-modes-by-port-modes';

export function isIoControllableByBindingType(
  io: AttachedIoModel,
  attachedIoModesEntities: Dictionary<AttachedIoModesModel>,
  attachedIoPortModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
  bindingType: ControlSchemeBindingType,
): boolean {
  const ioPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);

  const opModes = getOperationModesByPortModes(ioPortModeNames);

  return opModes.includes(bindingType);
}
