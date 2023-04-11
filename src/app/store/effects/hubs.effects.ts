import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../../types';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS } from '../actions';

@Injectable()
export class HubsEffects {
    public readonly startListening$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.startDiscovery),
            switchMap(() => this.hubStorage.discoverHub()),
            switchMap((hub) => {
                return this.hubStorage.getHub(hub.id).connect().then(() => ({ hubId: hub.id, name: hub.name ?? '' }))
                           .catch((error) => {
                               this.hubStorage.removeHub(hub.id);
                               throw error;
                           });
            }),
            map((data) => HUBS_ACTIONS.connected(data)),
            catchError((error) => of(HUBS_ACTIONS.deviceConnectFailed({ error })))
        );
    });

    public listenToBatteryLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.getHub(a.hubId).hubProperties.batteryLevel$.pipe(
                takeUntil(this.actions$.pipe(ofType(HUBS_ACTIONS.disconnected))),
                map((batteryLevel) => HUBS_ACTIONS.batteryLevelReceived({ hubId: a.hubId, batteryLevel }))
            ))
        );
    });

    public listenToRssiLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.getHub(a.hubId).hubProperties.rssiLevel$.pipe(
                takeUntil(this.actions$.pipe(ofType(HUBS_ACTIONS.disconnected))),
                map((rssiLevel) => HUBS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, rssiLevel }))
            ))
        );
    });

    public readonly deviceConnectFailedNotification$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.deviceConnectFailed),
            tap((e) => this.snackBar.open(e.error.l10nKey))
        );
    }, { dispatch: false });

    public readonly listenDeviceDisconnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            concatLatestFrom((action) => this.hubStorage.getHub(action.hubId).onDisconnected$),
            tap(([ action ]) => {
                this.hubBatteryLevelSubscriptions.get(action.hubId)?.unsubscribe();
                this.hubBatteryLevelSubscriptions.delete(action.hubId);
                this.hubRssiLevelSubscriptions.get(action.hubId)?.unsubscribe();
                this.hubRssiLevelSubscriptions.delete(action.hubId);
                this.hubStorage.removeHub(action.hubId);
            }),
            map(([ action ]) => HUBS_ACTIONS.disconnected({ hubId: action.hubId }))
        );
    });

    public readonly userRequestedHubDisconnection$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.userRequestedHubDisconnection),
            switchMap((a) => this.hubStorage.getHub(a.hubId).dispose().then(() => a.hubId)),
            map((id) => HUBS_ACTIONS.disconnected({ hubId: id }))
        );
    });

    private readonly hubBatteryLevelSubscriptions = new Map<string, Subscription>();

    private readonly hubRssiLevelSubscriptions = new Map<string, Subscription>();

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly snackBar: MatSnackBar,
        private readonly hubStorage: HubStorageService
    ) {
    }
}
