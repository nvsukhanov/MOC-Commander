import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalibrationResultType, HubServoCalibrationFacadeService } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { ATTACHED_IO_PROPS_ACTIONS, CONTROL_SCHEME_ACTIONS } from '../../actions';
import { ControlSchemeModel } from '../../models';
import { HubStorageService } from '../../hub-storage.service';
import { attachedIosIdFn } from '../../reducers';
import { CONTROL_SCHEME_SELECTORS } from '../../selectors';

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

function createServoCalibrationTasks(
    scheme: ControlSchemeModel,
    hubServoCalibrationFacade: HubServoCalibrationFacadeService,
    store: Store
): Array<Observable<unknown>> {
    const calibrateIos: Map<string, { hubId: string; portId: number; speed: number; power: number }> = new Map();
    scheme.bindings.forEach((binding) => {
        if (binding.bindingType !== ControlSchemeBindingType.Servo || !binding.calibrateOnStart) {
            return;
        }
        calibrateIos.set(attachedIosIdFn(binding), {
            hubId: binding.hubId,
            portId: binding.portId,
            speed: binding.speed,
            power: binding.power
        });
    });
    const tasks: Array<Observable<unknown>> = [];

    calibrateIos.forEach(({ hubId, portId, speed, power }) => {
        const task = hubServoCalibrationFacade.calibrateServo(hubId, portId, speed, power).pipe(
            map((r) => {
                if (r.type === CalibrationResultType.error) {
                    throw r.error;
                }
                return r;
            }),
            tap((result) => {
                if (result.type === CalibrationResultType.finished) {
                    store.dispatch(ATTACHED_IO_PROPS_ACTIONS.startupServoCalibrationDataReceived({
                        hubId,
                        portId,
                        range: result.range,
                        aposCenter: result.aposCenter
                    }));
                }
            })
        );
        tasks.push(task);
    });
    return tasks;
}

export const PRE_RUN_SCHEME_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    store: Store = inject(Store),
    hubCalibrationFacade: HubServoCalibrationFacadeService = inject(HubServoCalibrationFacadeService)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.startScheme),
        concatLatestFrom(({ name }) => store.select(CONTROL_SCHEME_SELECTORS.selectScheme(name))),
        map(([ , scheme ]) => scheme),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => {
            const combinedTasks = [
                ...createSetAccelerationProfileTasks(scheme, hubStorage),
                ...createSetDecelerationProfileTasks(scheme, hubStorage),
            ];
            const calibrationServoTasks = createServoCalibrationTasks(scheme, hubCalibrationFacade, store);
            if (calibrationServoTasks.length > 0) {
                combinedTasks.push(forkJoin(calibrationServoTasks));
            }
            if (combinedTasks.length === 0) {
                return of(CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name }));
            }
            return forkJoin(combinedTasks).pipe(
                map(() => CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name })),
                catchError(() => of(CONTROL_SCHEME_ACTIONS.schemeStartFailed()))
            );
        })
    );
}, { functional: true });