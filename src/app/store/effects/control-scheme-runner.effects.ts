import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_RUNNER_ACTIONS } from '../actions';
import { CONTROL_SCHEME_RUNNER_SELECTORS } from '../selectors';
import { filter, map, tap } from 'rxjs';
import { ConsoleLoggingService } from '../../logging';

@Injectable()
export class ControlSchemeRunnerEffects {
    public readonly runScheme$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_RUNNER_ACTIONS.runScheme),
            concatLatestFrom((action) => this.store.select(CONTROL_SCHEME_RUNNER_SELECTORS.canRunScheme(action.schemeId))),
            tap(([ action, checkResult ]) => {
                if (!checkResult.canRun) {
                    this.logger.error(
                        `Unable to run scheme ${action.schemeId} because of reasons: ${checkResult.reason.join(', ')}`,
                    );
                }
            }),
            filter(([ , checkResult ]) => checkResult.canRun),
            map(([ action ]) => CONTROL_SCHEME_RUNNER_ACTIONS.markSchemeAsRunning({ schemeId: action.schemeId }))
        );
    });

    constructor(
        private readonly store: Store,
        private readonly actions$: Actions,
        private readonly logger: ConsoleLoggingService
    ) {
    }
}
