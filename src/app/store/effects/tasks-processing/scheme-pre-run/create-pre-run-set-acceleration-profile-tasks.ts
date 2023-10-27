import { Observable } from 'rxjs';
import { ControlSchemeModel, HubStorageService, attachedIosIdFn } from '@app/store';

export function createPreRunSetAccelerationProfileTasks(
    scheme: ControlSchemeModel,
    hubStorage: HubStorageService
): Array<Observable<unknown>> {
    const ioIdsWithAccelerationProfiles = new Set(
        scheme.bindings.filter((b) => b.useAccelerationProfile).map((b) => attachedIosIdFn(b))
    );
    return scheme.portConfigs.filter((portConfig) => ioIdsWithAccelerationProfiles.has(attachedIosIdFn(portConfig)))
                 .map((portConfig) => {
                     return hubStorage
                         .get(portConfig.hubId)
                         .motors
                         .setAccelerationTime(portConfig.portId, portConfig.accelerationTimeMs);
                 });
}
