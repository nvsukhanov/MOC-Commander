import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, fromEvent, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS } from '../actions';
import { Router } from '@angular/router';
import { HUB_VIEW_ROUTE } from '../../routes';
import { HubDiscoveryService, HubProperty } from '../../lego-hub';
import { HubFactoryService } from '../../lego-hub/hub-factory.service';
import { WINDOW } from '../../types';
import { LpuConnectionError } from '../../lego-hub/errors';

@Injectable()
export class HubsEffects {
    public readonly startListening$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.startDiscovery),
            mergeMap(async () => {
                const device = await this.hubDiscovery.discoverHub();
                const hub = await this.hubFactoryService.createHub(
                    device,
                    fromEvent(this.window, 'beforeunload')
                );
                this.hubStorage.store(hub);
                return HUBS_ACTIONS.connected({ hubId: hub.id, name: hub.name ?? '' });
            }),
            catchError((error: unknown) => {
                if (error instanceof LpuConnectionError) {
                    return of(HUBS_ACTIONS.deviceConnectFailed({ error }));
                }
                return of(HUBS_ACTIONS.deviceConnectFailed({ error: new LpuConnectionError('Unknown error', 'unknownHubConnectionError') }));
            })
        );
    });

    public requestHubTypeOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                const hub = this.hubStorage.get(action.hubId);
                return hub.properties.getPropertyValue$(HubProperty.systemTypeId).pipe(
                    takeUntil(this.hubStorage.get(action.hubId).beforeDisconnect$),
                    map((message) => HUBS_ACTIONS.hubTypeReceived({ hubId: action.hubId, hubType: message.hubType }))
                );
            })
        );
    });

    public navigateToHubView$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            tap((a) => this.router.navigate([ HUB_VIEW_ROUTE, a.hubId ]))
        );
    }, { dispatch: false });

    public listenToBatteryLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.get(a.hubId).properties.batteryLevel$.pipe(
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect$),
                map((message) => HUBS_ACTIONS.batteryLevelReceived({ hubId: a.hubId, batteryLevel: message.level }))
            ))
        );
    });

    public listenToRssiLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.get(a.hubId).properties.rssiLevel$.pipe(
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect$),
                map((message) => HUBS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, rssiLevel: message.level }))
            ))
        );
    });

    public listerToButtonStateOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.get(a.hubId).properties.buttonState$.pipe(
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect$),
                map((message) => HUBS_ACTIONS.buttonStateReceived({ hubId: a.hubId, isPressed: message.isPressed }))
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
            mergeMap((action) => this.hubStorage.get(action.hubId).disconnected$.pipe(
                tap(() => {
                    this.hubStorage.removeHub(action.hubId);
                }),
                map(() => HUBS_ACTIONS.disconnected({ hubId: action.hubId }))
            )),
        );
    });

    public readonly userRequestedHubDisconnection$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.userRequestedHubDisconnection),
            mergeMap((a) => this.hubStorage.get(a.hubId).disconnect().pipe(
                map(() => HUBS_ACTIONS.disconnected({ hubId: a.hubId }))
            ))
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly snackBar: MatSnackBar,
        private readonly hubDiscovery: HubDiscoveryService,
        private readonly hubFactoryService: HubFactoryService,
        private readonly hubStorage: HubStorageService,
        private readonly router: Router,
        @Inject(WINDOW) private readonly window: Window
    ) {
    }
}
