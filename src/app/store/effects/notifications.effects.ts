import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { MonoTypeOperatorFunction, Observable, filter, map, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { ScreenSizeObserverService } from '@app/shared';

import { CONTROLLERS_ACTIONS, CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS } from '../actions';
import { CONTROLLER_SELECTORS } from '../selectors';
import { ControllerModel } from '../models';
import { ControllerProfileFactoryService } from '../controller-profile-factory.service';

@Injectable()
export class NotificationsEffects {
    public readonly deviceConnectFailedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.deviceConnectFailed),
            map((error) => error.error.message),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly deviceConnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            switchMap((action) => this.translocoService.selectTranslate('hub.connected', action)),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly deviceDisconnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            switchMap((action) => this.translocoService.selectTranslate('hub.disconnected', action)),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly servoCalibrationErrorNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.servoCalibrationError),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.servoBinding.calibrationError')),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly controllerDiscovered$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadDiscovered, CONTROLLERS_ACTIONS.keyboardDiscovered),
            switchMap((action) => {
                const controllerProfile = this.controllerProfilesFactory.getByProfileUid(action.profileUid);
                return controllerProfile.name$;
            }),
            switchMap((name) => this.translocoService.selectTranslate('controller.controllerDiscoveredNotification', { name })),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly controllerConnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadConnected, CONTROLLERS_ACTIONS.keyboardConnected),
            switchMap((action) => {
                const controllerProfile = this.controllerProfilesFactory.getByProfileUid(action.profileUid);
                return controllerProfile.name$;
            }),
            switchMap((name) => this.translocoService.selectTranslate('controller.controllerConnectedNotification', { name })),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly controllerDisconnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadDisconnected),
            concatLatestFrom((action) => this.store.select(CONTROLLER_SELECTORS.selectById(action.id))),
            map(([ , controllerModel ]) => controllerModel),
            filter((controllerModel): controllerModel is ControllerModel => !!controllerModel),
            switchMap((controllerModel) => {
                const controllerProfile = this.controllerProfilesFactory.getByProfileUid(controllerModel.profileUid);
                return controllerProfile.name$;
            }),
            switchMap((name) => this.translocoService.selectTranslate('controller.controllerDisconnectedNotification', { name })),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly controlSchemeExportStringCopied$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.copyExportString),
            switchMap(() => this.translocoService.selectTranslate('controlScheme.exportStringCopiedNotification')),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly controlSchemeImported$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.importControlScheme),
            switchMap((action) => this.translocoService.selectTranslate('controlScheme.importSuccessNotification', action.scheme)),
            this.showMessage()
        );
    }, { dispatch: false });

    public readonly hubNameSetError$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.hubNameSetError),
            switchMap(() => this.translocoService.selectTranslate('hub.hubNameSetError')),
            this.showMessage()
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly snackBar: MatSnackBar,
        private readonly translocoService: TranslocoService,
        private readonly controllerProfilesFactory: ControllerProfileFactoryService,
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }

    private showMessage(): MonoTypeOperatorFunction<string> {
        return (source: Observable<string>) => source.pipe(
            concatLatestFrom(() => this.screenSizeObserverService.isSmallScreen$),
            tap(([ message, isSmallScreen ]) => {
                this.snackBar.open(
                    message,
                    'OK',
                    {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: isSmallScreen ? 'top' : 'bottom'
                    }
                );
            }),
            map(([ message ]) => message)
        );
    }
}
