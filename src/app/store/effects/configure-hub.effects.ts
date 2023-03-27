import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../../types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTION_CONFIGURE_HUB_TERMINATION, ACTIONS_CONFIGURE_HUB } from '../actions';
import { IState } from '../i-state';
import { catchError, map, NEVER, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LpuHubStorageService } from '../lpu-hub-storage.service';

@Injectable()
export class ConfigureHubEffects {
    public readonly startListening$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.startDiscovery),
        switchMap(() => this.lpuHubStorageService.discoverHub()),
        map(() => ACTIONS_CONFIGURE_HUB.connecting()),
        catchError((error) => of(ACTIONS_CONFIGURE_HUB.deviceConnectFailed({ error })))
    ));

    public readonly connect$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connecting),
        switchMap(() => this.lpuHubStorageService.getHub().connect()),
        map(() => ACTIONS_CONFIGURE_HUB.connected()),
        catchError((error) => of(ACTIONS_CONFIGURE_HUB.deviceConnectFailed({ error })))
    ));

    public readonly readBatteryLevel = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((d) => d.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().hubProperties.batteryLevel$
                         : of(null)
        ),
        map((batteryLevel) => ACTIONS_CONFIGURE_HUB.batteryLevelUpdate({ batteryLevel }))
    ));

    public readonly readRssiLevel = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((d) => d.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().hubProperties.rssiLevel$
                         : of(null)
        ),
        map((rssiLevel) => ACTIONS_CONFIGURE_HUB.rssiLevelUpdate({ rssiLevel }))
    ));

    public readonly nameLevel = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((d) => d.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().hubProperties.name$
                         : of(null)
        ),
        map((name) => ACTIONS_CONFIGURE_HUB.nameUpdate({ name }))
    ));

    public readonly deviceConnectFailedNotification$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.deviceConnectFailed),
        tap((e) => this.snackBar.open(e.error.l10nKey))
    ), { dispatch: false });

    public deviceDisconnect$ = createEffect(() => this.actions.pipe(
        ofType(
            ACTIONS_CONFIGURE_HUB.connected,
            ...ACTION_CONFIGURE_HUB_TERMINATION
        ),
        switchMap((action) => {
                if (action.type === ACTIONS_CONFIGURE_HUB.connected.type) {
                    return this.lpuHubStorageService.getHub().onDisconnected$;
                } else {
                    return NEVER;
                }
            }
        ),
        tap(() => this.lpuHubStorageService.removeHub()),
        map(() => ACTIONS_CONFIGURE_HUB.disconnected())
    ));

    public userRequestedHubDisconnection$ = createEffect(() => this.actions.pipe(
        ofType(
            ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection
        ),
        switchMap(() => this.lpuHubStorageService.getHub().dispose()),
        map(() => ACTIONS_CONFIGURE_HUB.disconnected())
    ));

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions: Actions,
        private readonly store: Store<IState>,
        private readonly snackBar: MatSnackBar,
        private readonly lpuHubStorageService: LpuHubStorageService
    ) {
    }
}
