import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS } from '../actions';
import { filter, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_ROUTE } from '../../routes';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS, CONTROL_SCHEME_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';

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
            concatLatestFrom((action) => this.store.select(CONTROL_SCHEME_SELECTORS.canRunScheme(action.schemeId))),
            filter(([ , checkResult ]) => checkResult),
            map(([ action ]) => CONTROL_SCHEME_ACTIONS.markSchemeAsRunning({ schemeId: action.schemeId }))
        );
    });

    public readonly stopSchemeOnHubDisconnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId)),
            filter(([ , schemeId ]) => schemeId !== null),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            concatLatestFrom(([ , schemeId ]) => this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(schemeId!))),
            filter(([ [ action ], scheme ]) => !!scheme && scheme.bindings.some((binding) => binding.output.hubId === action.hubId)),
            map(() => CONTROL_SCHEME_ACTIONS.stopRunning())
        );
    });

    public readonly stopSchemeOnDelete$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.delete),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId)),
            filter(([ action, schemeId ]) => schemeId === action.id),
            map(() => CONTROL_SCHEME_ACTIONS.stopRunning())
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router,
        private readonly store: Store,
    ) {
    }
}
