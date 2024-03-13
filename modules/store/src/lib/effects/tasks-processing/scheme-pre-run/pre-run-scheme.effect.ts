import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { MonoTypeOperatorFunction, Observable, catchError, concatWith, filter, forkJoin, last, map, of, switchMap, timeout } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { APP_CONFIG, IAppConfig } from '@app/shared-misc';

import { CONTROL_SCHEME_ACTIONS } from '../../../actions';
import { ControlSchemeModel } from '../../../models';
import { HubStorageService } from '../../../hub-storage.service';
import { CONTROL_SCHEME_SELECTORS } from '../../../selectors';
import { createPreRunServoCalibrationTasks } from './create-pre-run-servo-calibration-tasks';
import { createPreRunSetAccelerationProfileTasks } from './create-pre-run-set-acceleration-profile-tasks';
import { createPreRunSetDecelerationProfileTasks } from './create-pre-run-set-deceleration-profile-tasks';
import { createWidgetReadTasks } from './create-widget-read-tasks';
import { HubServoCalibrationFacadeService } from '../../../hub-facades';
import { IWidgetsReadTasksFactory, WIDGET_READ_TASKS_FACTORY } from './i-widgets-read-tasks-factory';
import { createPreRunMotorPositionQueryTasks } from './create-pre-run-motor-position-query-tasks';

function runTasksInParallel(
    tasks: Array<Observable<unknown>>
): MonoTypeOperatorFunction<unknown> {
    if (tasks.length === 0) {
        return (source) => source;
    }

    return (source) => source.pipe(
        switchMap(() => forkJoin(tasks)),
        last()
    );
}

function runTasksSequentially(
    tasks: Array<Observable<unknown>>
): MonoTypeOperatorFunction<unknown> {
    if (tasks.length === 0) {
        return (source) => source;
    }
    return (source) => source.pipe(
        concatWith(...tasks),
        last()
    );
}

export const PRE_RUN_SCHEME_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    store: Store = inject(Store),
    hubCalibrationFacade: HubServoCalibrationFacadeService = inject(HubServoCalibrationFacadeService),
    appConfig: IAppConfig = inject(APP_CONFIG),
    widgetReadTaskFactory: IWidgetsReadTasksFactory = inject(WIDGET_READ_TASKS_FACTORY)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.startScheme),
        concatLatestFrom(({ name }) => store.select(CONTROL_SCHEME_SELECTORS.selectScheme(name))),
        map(([ , scheme ]) => scheme),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => {
            return of(null).pipe(
                // Calibration tasks are run sequentially bc of some issue with port value reading while calibrating in parralel
                // TODO: investigate and fix the issue. Not a priority now.
                runTasksSequentially(
                    createPreRunServoCalibrationTasks(scheme, hubCalibrationFacade, store, appConfig)
                ),
                runTasksInParallel([
                    ...createPreRunMotorPositionQueryTasks(scheme, hubStorage, store),
                    ...createPreRunSetAccelerationProfileTasks(scheme, hubStorage),
                    ...createPreRunSetDecelerationProfileTasks(scheme, hubStorage),
                    ...createWidgetReadTasks(scheme, store, widgetReadTaskFactory),
                ]),
                timeout(appConfig.schemeStartStopTimeoutMs),
                map(() => CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name })),
                catchError((e) => of(CONTROL_SCHEME_ACTIONS.schemeStartFailed({ reason: e })))
            );
        })
    );
}, { functional: true });
