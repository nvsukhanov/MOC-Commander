import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_ROUTE } from '../../routes';

@Injectable()
export class ControlSchemeEffects {
    public readonly schemeCreate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.create),
            tap((data) => this.router.navigate([ CONTROL_SCHEME_ROUTE, data.id ])),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router
    ) {
    }
}
