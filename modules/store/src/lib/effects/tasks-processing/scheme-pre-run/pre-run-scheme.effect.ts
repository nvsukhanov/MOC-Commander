import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, forkJoin, map, of, switchMap, timeout } from 'rxjs';
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
import { IWidgetReadTaskFactory, WIDGET_READ_TASK_FACTORY } from './i-widget-read-task-factory';

export const PRE_RUN_SCHEME_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
    store: Store = inject(Store),
    hubCalibrationFacade: HubServoCalibrationFacadeService = inject(HubServoCalibrationFacadeService),
    appConfig: IAppConfig = inject(APP_CONFIG),
    widgetReadTaskFactory: IWidgetReadTaskFactory = inject(WIDGET_READ_TASK_FACTORY)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.startScheme),
        concatLatestFrom(({ name }) => store.select(CONTROL_SCHEME_SELECTORS.selectScheme(name))),
        map(([ , scheme ]) => scheme),
        filter((scheme): scheme is ControlSchemeModel => !!scheme),
        switchMap((scheme) => {
            const controlSchemeStopEvent$ = actions.pipe(
                ofType(CONTROL_SCHEME_ACTIONS.stopScheme),
            );
            const combinedTasks = [
                ...createPreRunSetAccelerationProfileTasks(scheme, hubStorage),
                ...createPreRunSetDecelerationProfileTasks(scheme, hubStorage),
                ...createWidgetReadTasks(scheme, hubStorage, store, controlSchemeStopEvent$, widgetReadTaskFactory)
            ];
            // TODO: move to Bindings module
            const calibrationServoTasks = createPreRunServoCalibrationTasks(scheme, hubCalibrationFacade, store, appConfig);
            if (calibrationServoTasks.length > 0) {
                combinedTasks.push(forkJoin(calibrationServoTasks));
            }
            if (combinedTasks.length === 0) {
                return of(CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name }));
            }
            return forkJoin(combinedTasks).pipe(
                timeout(appConfig.schemeStartStopTimeoutMs),
                map(() => CONTROL_SCHEME_ACTIONS.schemeStarted({ name: scheme.name })),
                catchError((e) => of(CONTROL_SCHEME_ACTIONS.schemeStartFailed({ reason: e })))
            );
        })
    );
}, { functional: true });
