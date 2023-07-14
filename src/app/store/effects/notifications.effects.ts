import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

import { CONTROLLERS_ACTIONS, CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS } from '../actions';
import { ControllerPluginFactoryService } from '../../plugins';

@Injectable()
export class NotificationsEffects {
    public readonly deviceConnectFailedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.deviceConnectFailed),
            tap((error) => this.showMessage(error.error.message))
        );
    }, { dispatch: false });

    public readonly deviceConnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            switchMap((action) => this.translocoService.selectTranslate('hub.connected', action)),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly deviceDisconnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            switchMap((action) => this.translocoService.selectTranslate('hub.disconnected', action)),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly servoCalibrationErrorNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.servoCalibrationError),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.servoCalibrationError')),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly controlSchemeInputRebindSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.inputRebindSuccess),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.bindToAnotherInputSuccess')),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly controlSchemeInputRebindTypeMismatch$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.inputRebindTypeMismatch),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.bindToAnotherInputTypeMismatchError')),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly noIOForInputFound$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.noIOForInputFound),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.noMatchingIoForInputFound')),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly controllerConnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.connected),
            switchMap((action) => {
                const controllerPlugin = this.controllerPluginFactory.getPlugin(action.controllerType, action.id);
                return this.translocoService.selectTranslate(controllerPlugin.nameL10nKey);
            }),
            switchMap((name) => this.translocoService.selectTranslate('controller.controllerConnectedNotification', { name })),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    public readonly controllerDisconnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.disconnected),
            switchMap((action) => {
                const controllerPlugin = this.controllerPluginFactory.getPlugin(action.controllerType, action.id);
                return this.translocoService.selectTranslate(controllerPlugin.nameL10nKey);
            }),
            switchMap((name) => this.translocoService.selectTranslate('controller.controllerDisconnectedNotification', { name })),
            tap((message) => this.showMessage(message))
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly snackBar: MatSnackBar,
        private readonly translocoService: TranslocoService,
        private readonly controllerPluginFactory: ControllerPluginFactoryService
    ) {
    }

    private showMessage(
        message: string
    ): void {
        this.snackBar.open(
            message,
            'OK',
            {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom'
            }
        );
    }
}
