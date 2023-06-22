import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NEVER, filter, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

import { CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS } from '../selectors';
import { RoutesBuilderService } from '../../routing';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_CONFIGURATION_ACTIONS } from '../actions';
import { WaitingForInputDialogComponent } from '../../control-schemes/waiting-for-input-dialog';

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

    public readonly showModalOnListenStart$ = createEffect(() => {
        return this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.isListening).pipe(
            filter((isListening) => isListening),
            switchMap(() => {
                this.dialogRef = this.dialog.open(WaitingForInputDialogComponent, {
                    hasBackdrop: true,
                    disableClose: true
                });
                return this.dialogRef.componentInstance?.cancel.asObservable() ?? NEVER;
            }),
            map(() => CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening()),
        );
    });

    public readonly hideDialodOnListenStop$ = createEffect(() => {
        return this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.isListening).pipe(
            filter((isListening) => !isListening),
            tap(() => {
                this.dialogRef?.close();
                this.dialogRef = undefined;
            }),
        );
    }, { dispatch: false });

    private dialogRef?: DialogRef<unknown, WaitingForInputDialogComponent>;

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router,
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly dialog: Dialog,
    ) {
    }
}
