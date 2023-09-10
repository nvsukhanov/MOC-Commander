import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel, HubStorageService, attachedIosIdFn } from '@app/store';

function createSetAccelerationProfileTasks(
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

function createSetDecelerationProfileTasks(
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

export const PRE_RUN_SCHEME_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    store: Store = inject(Store)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.startScheme),
        concatLatestFrom(({ name }) => store.select(CONTROL_SCHEME_SELECTORS.selectScheme(name))),
        map(([ , scheme ]) => scheme),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => {
            const combinedTasks = [
                ...createSetAccelerationProfileTasks(scheme, hubStorage),
                ...createSetDecelerationProfileTasks(scheme, hubStorage)
            ];
            if (combinedTasks.length === 0) {
                return of({ name: scheme.name });
            }
            return forkJoin(combinedTasks).pipe(
                map(() => ({ name: scheme.name }))
            );
        }),
        map((action) => CONTROL_SCHEME_ACTIONS.schemeStarted({ name: action.name }))
    );
}, { functional: true });