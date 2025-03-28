import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel } from '@app/store';

import { getIoOutputPortModeNames } from './get-io-output-port-mode-names';
import { ioHasMatchingModeForOpMode } from './io-has-matching-mode-for-op-mode';

export function isIoControllableByBindingType(
  io: AttachedIoModel,
  attachedIoModesEntities: Dictionary<AttachedIoModesModel>,
  attachedIoPortModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
  bindingType: ControlSchemeBindingType,
): boolean {
  const ioPortModeNames = getIoOutputPortModeNames(io, attachedIoModesEntities, attachedIoPortModeInfoEntities);
  return ioHasMatchingModeForOpMode(bindingType, ioPortModeNames);
}
