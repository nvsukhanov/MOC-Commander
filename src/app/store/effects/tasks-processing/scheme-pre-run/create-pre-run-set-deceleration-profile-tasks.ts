import { Observable } from 'rxjs';
import { ControlSchemeModel, HubStorageService, attachedIosIdFn } from '@app/store';

export function createPreRunSetDecelerationProfileTasks(
    scheme: ControlSchemeModel,
    hubStorage: HubStorageService
): Array<Observable<unknown>> {
    const ioIdsWithDecelerationProfiles = new Set(
        scheme.bindings.filter((b) => b.useDecelerationProfile).map((b) => attachedIosIdFn(b))
    );
    return scheme.portConfigs.filter((portConfig) => ioIdsWithDecelerationProfiles.has(attachedIosIdFn(portConfig)))
                 .map((portConfig) => {
                     return hubStorage
                         .get(portConfig.hubId)
                         .motors
                         .setDecelerationTime(portConfig.portId, portConfig.decelerationTimeMs);
                 });
}
