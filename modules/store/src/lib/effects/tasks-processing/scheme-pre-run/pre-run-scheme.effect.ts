import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatWith, filter, forkJoin, last, map, of, switchMap, tap, timeout } from 'rxjs';
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
            const combinedTasks = [
                ...createPreRunSetAccelerationProfileTasks(scheme, hubStorage),
                ...createPreRunSetDecelerationProfileTasks(scheme, hubStorage),
                ...createWidgetReadTasks(scheme, store, widgetReadTaskFactory),
                ...createPreRunMotorPositionQueryTasks(scheme, hubStorage, store)
            ];
            // TODO: move to Bindings module
            const calibrationServoTasks = createPreRunServoCalibrationTasks(scheme, hubCalibrationFacade, store, appConfig);
            if (combinedTasks.length + calibrationServoTasks.length === 0) {
                return of(CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name }));
            }

            return forkJoin(combinedTasks).pipe(
                // We have to start calibration tasks after all other tasks are done to avoid race conditions with position queries.
                // Also, somehow running calibration tasks in parallel causes issues with receiving port values.
                // For now, we run them sequentially. TODO: investigate and fix the root cause.
                calibrationServoTasks.length > 0 ? concatWith(...calibrationServoTasks) : tap(() => void 0),
                last(),
                timeout(appConfig.schemeStartStopTimeoutMs),
                map(() => CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name })),
                catchError((e) => of(CONTROL_SCHEME_ACTIONS.schemeStartFailed({ reason: e })))
            );
        })
    );
}, { functional: true });
