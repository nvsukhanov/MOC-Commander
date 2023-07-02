import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

import { RoutesBuilderService } from '../../routing';
import { CONTROL_SCHEME_ACTIONS } from '../actions';

@Injectable()
export class ControlSchemeEffects {
    public readonly schemeCreated$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.create),
            tap((data) => this.router.navigate(this.routesBuilderService.controlSchemeView(data.id))),
        );
    }, { dispatch: false });

    public readonly schemeUpdated$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.update),
            tap((data) => this.router.navigate(this.routesBuilderService.controlSchemeView(data.id))),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router,
        private readonly routesBuilderService: RoutesBuilderService,
    ) {
    }
}
