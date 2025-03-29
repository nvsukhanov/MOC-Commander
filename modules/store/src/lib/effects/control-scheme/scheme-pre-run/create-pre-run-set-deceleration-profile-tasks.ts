import { Observable } from 'rxjs';

import { ControlSchemeModel } from '../../../models';
import { HubStorageService } from '../../../hub-storage.service';
import { attachedIosIdFn } from '../../../reducers';
import { isUsingDecelerationProfile } from '../../../helpers';

export function createPreRunSetDecelerationProfileTasks(
  scheme: ControlSchemeModel,
  hubStorage: HubStorageService,
): Array<Observable<unknown>> {
  const ioIdsWithDecelerationProfiles = new Set(
    scheme.bindings.filter((b) => isUsingDecelerationProfile(b)).map((b) => attachedIosIdFn(b)),
  );
  return scheme.portConfigs
    .filter((portConfig) => ioIdsWithDecelerationProfiles.has(attachedIosIdFn(portConfig)))
    .map((portConfig) => {
      return hubStorage
        .get(portConfig.hubId)
        .motors.setDecelerationTime(portConfig.portId, portConfig.decelerationTimeMs);
    });
}
