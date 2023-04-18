import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS } from '../selectors';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_ROUTE } from '../../routes';

@Injectable()
export class ControlSchemeEffects {
    public readonly schemeCreate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.create),
            concatLatestFrom(() => this.store.select(CONTROL_SCHEME_SELECTORS.selectAll)),
            map(([ , schemes ]) => {
                const nextIndex = Math.max(0, ...schemes.map((scheme) => scheme.index)) + 1;
                return CONTROL_SCHEME_ACTIONS.created({
                    name: `Scheme ${nextIndex}`,
                    id: crypto.randomUUID(),
                    index: nextIndex
                });
            })
        );
    });

    public readonly schemeCreated$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.created),
            map(({ id }) => this.router.navigate([ CONTROL_SCHEME_ROUTE, id ]))
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly router: Router
    ) {
    }
}
