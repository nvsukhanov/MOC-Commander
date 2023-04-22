import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { filter, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_ROUTE } from '../../routes';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';
import { ConsoleLoggingService } from '../../logging';

@Injectable()
export class ControlSchemeEffects {
    public readonly schemeCreate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.create),
            tap((data) => this.router.navigate([ CONTROL_SCHEME_ROUTE, data.id ])),
        );
    }, { dispatch: false });

    public readonly runScheme$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.runScheme),
            concatLatestFrom((action) => this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.canRunScheme(action.schemeId))),
            tap(([ action, checkResult ]) => {
                if (!checkResult.canRun) {
                    this.logger.error(
                        `Unable to run scheme ${action.schemeId} because of reasons: ${checkResult.reason.join(', ')}`,
                    );
                }
            }),
            filter(([ , checkResult ]) => checkResult.canRun),
            map(([ action ]) => CONTROL_SCHEME_ACTIONS.markSchemeAsRunning({ schemeId: action.schemeId }))
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router,
        private readonly store: Store,
        private readonly logger: ConsoleLoggingService
    ) {
    }
}
