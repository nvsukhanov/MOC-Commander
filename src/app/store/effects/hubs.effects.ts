import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../../types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IState } from '../i-state';
import { catchError, map, of, Subscription, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS } from '../actions';

@Injectable()
export class HubsEffects {
    public readonly startListening$ = createEffect(() => this.actions$.pipe(
        ofType(HUBS_ACTIONS.startDiscovery),
        switchMap(() => this.hubStorage.discoverHub()),
        switchMap((hub) => {
            return this.hubStorage.getHub(hub.id).connect().then(() => ({ hubId: hub.id, name: hub.name ?? '' }))
                       .catch((error) => {
                           this.hubStorage.removeHub(hub.id);
                           throw error;
                       });
        }),
        tap(({ hubId }) => {
            const rssiLevelSubscription = this.hubStorage.getHub(hubId).hubProperties.rssiLevel$.subscribe(rssiLevel => {
                this.store.dispatch(HUBS_ACTIONS.rssiLevelReceived({ hubId, rssiLevel }));
            });
            this.hubRssiLevelSubscriptions.set(hubId, rssiLevelSubscription);
            const batteryLevelSubscription = this.hubStorage.getHub(hubId).hubProperties.batteryLevel$.subscribe(batteryLevel => {
                this.store.dispatch(HUBS_ACTIONS.batteryLevelReceived({ hubId, batteryLevel }));
            });
            this.hubBatteryLevelSubscriptions.set(hubId, batteryLevelSubscription);
        }),
        map((data) => HUBS_ACTIONS.connected(data)),
        catchError((error) => of(HUBS_ACTIONS.deviceConnectFailed({ error })))
    ));

    public readonly deviceConnectFailedNotification$ = createEffect(() => this.actions$.pipe(
        ofType(HUBS_ACTIONS.deviceConnectFailed),
        tap((e) => this.snackBar.open(e.error.l10nKey))
    ), { dispatch: false });

    public readonly listenDeviceDisconnect$ = createEffect(() => this.actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        tap(({ hubId }) => {
            this.hubStorage.getHub(hubId).onDisconnected$.subscribe(() => {
                this.hubBatteryLevelSubscriptions.get(hubId)?.unsubscribe();
                this.hubBatteryLevelSubscriptions.delete(hubId);
                this.hubRssiLevelSubscriptions.get(hubId)?.unsubscribe();
                this.hubRssiLevelSubscriptions.delete(hubId);
                this.hubStorage.removeHub(hubId);

                this.store.dispatch(HUBS_ACTIONS.disconnected({ hubId }));
            });
        })
    ), { dispatch: false });

    public readonly userRequestedHubDisconnection$ = createEffect(() => this.actions$.pipe(
        ofType(HUBS_ACTIONS.userRequestedHubDisconnection),
        switchMap((a) => this.hubStorage.getHub(a.hubId).dispose().then(() => a.hubId)),
        map((id) => HUBS_ACTIONS.disconnected({ hubId: id }))
    ));

    private readonly hubBatteryLevelSubscriptions = new Map<string, Subscription>();

    private readonly hubRssiLevelSubscriptions = new Map<string, Subscription>();

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        private readonly snackBar: MatSnackBar,
        private readonly hubStorage: HubStorageService
    ) {
    }
}
