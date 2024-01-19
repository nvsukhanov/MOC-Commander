import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, OperatorFunction, filter, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Action, Store } from '@ngrx/store';
import { GamepadProfileFactoryService, KeyboardProfileFactoryService } from '@app/controller-profiles';
import { ScreenSizeObserverService } from '@app/shared-misc';

import { CONTROLLERS_ACTIONS, CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS } from '../actions';
import { CONTROLLER_SELECTORS } from '../selectors';
import { ControllerModel } from '../models';
import { ControllerProfilesFacadeService } from '../controller-profiles-facade.service';

@Injectable()
export class NotificationsEffects {
    public readonly deviceConnectFailedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.deviceConnectFailed),
            this.showMessage((error) => of(error.error.message))
        );
    }, { dispatch: false });

    public readonly deviceConnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            this.showMessage((action) => this.translocoService.selectTranslate('hub.connected', action))
        );
    }, { dispatch: false });

    public readonly deviceDisconnectedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.disconnected),
            this.showMessage((action) => this.translocoService.selectTranslate('hub.disconnected', action))
        );
    }, { dispatch: false });

    public readonly servoCalibrationErrorNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.servoCalibrationError),
            this.showMessage(() => this.translocoService.selectTranslate('controlScheme.servoBinding.calibrationError')),
        );
    }, { dispatch: false });

    public readonly controllerDiscovered$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadDiscovered, CONTROLLERS_ACTIONS.keyboardDiscovered),
            this.showMessage((action) => {
                switch (action.type) {
                    case CONTROLLERS_ACTIONS.gamepadDiscovered.type:
                        return this.gamepadProfileFactoryService.getByProfileUid(action.profileUid).name$.pipe(
                            switchMap((name) => this.translocoService.selectTranslate('controller.controllerDiscoveredNotification', { name }))
                        );
                    case CONTROLLERS_ACTIONS.keyboardDiscovered.type:
                        return this.keyboardProfileFactoryService.getByProfileUid(action.profileUid).name$.pipe(
                            switchMap((name) => this.translocoService.selectTranslate('controller.controllerDiscoveredNotification', { name }))
                        );
                }
            })
        );
    }, { dispatch: false });

    public readonly controllerConnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadConnected, CONTROLLERS_ACTIONS.keyboardConnected),
            this.showMessage((action) => {
                switch (action.type) {
                    case CONTROLLERS_ACTIONS.gamepadConnected.type:
                        return this.gamepadProfileFactoryService.getByProfileUid(action.profileUid).name$.pipe(
                            switchMap((name) => this.translocoService.selectTranslate('controller.controllerConnectedNotification', { name }))
                        );
                    case CONTROLLERS_ACTIONS.keyboardConnected.type:
                        return this.keyboardProfileFactoryService.getByProfileUid(action.profileUid).name$.pipe(
                            switchMap((name) => this.translocoService.selectTranslate('controller.controllerConnectedNotification', { name }))
                        );
                }
            })
        );
    }, { dispatch: false });

    public readonly controllerDisconnected$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.gamepadDisconnected),
            this.showMessage((action) => this.store.select(CONTROLLER_SELECTORS.selectById(action.id)).pipe(
                filter((controller): controller is ControllerModel => !!controller),
                switchMap((controller) => this.controllerProfilesFacade.getByControllerModel(controller).name$),
                switchMap((name) => this.translocoService.selectTranslate('controller.controllerDisconnectedNotification', { name }))
            ))
        );
    }, { dispatch: false });

    public readonly controlSchemeExportStringCopied$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.copyExportString),
            this.showMessage(() => this.translocoService.selectTranslate('controlScheme.exportStringCopiedNotification')),
        );
    }, { dispatch: false });

    public readonly controlSchemeImported$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.importControlScheme),
            this.showMessage((action) => this.translocoService.selectTranslate('controlScheme.importSuccessNotification', action.scheme)),
        );
    }, { dispatch: false });

    public readonly hubNameSetError$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.hubNameSetError),
            this.showMessage(() => this.translocoService.selectTranslate('hub.hubNameSetError')),
        );
    }, { dispatch: false });

    public readonly startSchemeFailed$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CONTROL_SCHEME_ACTIONS.schemeStartFailed),
            this.showMessage(() => this.translocoService.selectTranslate('controlScheme.runFailed')),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly snackBar: MatSnackBar,
        private readonly translocoService: TranslocoService,
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly controllerProfilesFacade: ControllerProfilesFacadeService,
        private readonly keyboardProfileFactoryService: KeyboardProfileFactoryService,
        private readonly gamepadProfileFactoryService: GamepadProfileFactoryService,
    ) {
    }

    private showMessage<T extends Action>(
        fn: (action: T) => Observable<string>
    ): OperatorFunction<T, unknown> {
        return (source: Observable<T>) => source.pipe(
            concatLatestFrom((action) => [
                fn(action),
                this.screenSizeObserverService.isSmallScreen$
            ]),
            tap(([ , message, isSmallScreen ]) => {
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
        );
    }
}
