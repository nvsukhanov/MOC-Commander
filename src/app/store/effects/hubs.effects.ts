import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, from, fromEvent, interval, map, mergeMap, Observable, of, startWith, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS } from '../actions';
import {
    HubDiscoveryService,
    HubFactoryService,
    HubProperty,
    LoggingMiddlewareFactoryService,
    LpuConnectionError,
    LpuConnectionErrorFactoryService
} from '../../lego-hub';
import { WINDOW } from '../../types';
import { Action, Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ConsoleLoggingService } from '../../logging';
import { HubCommunicationNotifierMiddlewareFactoryService } from '../hub-communication-notifier-middleware-factory.service';
import { Router } from '@angular/router';
import { ROUTER_SELECTORS } from '../selectors';
import { HUB_ROUTE } from '../../routes';

@Injectable()
export class HubsEffects {
    public readonly startListening$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.startDiscovery),
            mergeMap(() => this.hubDiscovery$())
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

    public listenToBatteryLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.hubBatteryPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect$),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getPropertyValue$(HubProperty.batteryVoltage)),
                map((message) => HUBS_ACTIONS.batteryLevelReceived({ hubId: a.hubId, batteryLevel: message.level }))
            ))
        );
    });

    public listenToRssiLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.hubRSSIPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect$),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getPropertyValue$(HubProperty.RSSI)),
                map((message) => HUBS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, RSSI: message.level }))
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
            switchMap((e) => this.translocoService.selectTranslate(e.error.l10nKey, e.error.translationParams)),
            tap((message) => this.snackBar.open(message, 'OK', { duration: 5000 }))
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

    public readonly requestSetHubName$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.requestSetHubName),
            mergeMap((a) => from(this.hubStorage.get(a.hubId).properties.setHubAdvertisingName(a.name)).pipe(
                switchMap(() => this.hubStorage.get(a.hubId).properties.getPropertyValue$(HubProperty.advertisingName)),
                map((message) => HUBS_ACTIONS.hubNameSet({ hubId: a.hubId, name: message.advertisingName }))
            ))
        );
    });

    public readonly closeEditPageOnSaveCompleted$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.hubNameSet),
            concatLatestFrom(() => this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId)),
            filter(([ a, b ]) => a.hubId === b),
            tap(([ , hubId ]) => this.router.navigate([ HUB_ROUTE, hubId ]))
        );
    }, { dispatch: false });

    private readonly hubBatteryPollInterval = 20000; // TODO: move to config

    private readonly hubRSSIPollInterval = 5000; // TODO: move to config

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        private readonly hubDiscovery: HubDiscoveryService,
        private readonly hubFactoryService: HubFactoryService,
        private readonly hubStorage: HubStorageService,
        private readonly translocoService: TranslocoService,
        private readonly lpuConnectionErrorFactory: LpuConnectionErrorFactoryService,
        private readonly logger: ConsoleLoggingService,
        private readonly loggingMiddlewareFactory: LoggingMiddlewareFactoryService,
        private readonly communicationNotifierMiddlewareFactory: HubCommunicationNotifierMiddlewareFactoryService,
        @Inject(WINDOW) private readonly window: Window
    ) {
    }

    private hubDiscovery$(): Observable<Action> {
        return from(this.hubDiscovery.discoverHub()).pipe(
            switchMap((device) => {
                const incomingLoggerMiddleware = this.loggingMiddlewareFactory.create(
                    this.logger,
                    `[${device.name}] Incoming`,
                    'all'
                );
                const outgoingLoggerMiddleware = this.loggingMiddlewareFactory.create(
                    this.logger,
                    `[${device.name}] Outgoing`,
                    'all'
                );
                const communicationNotifierMiddleware = this.communicationNotifierMiddlewareFactory.create();

                return this.hubFactoryService.connectToHub(
                    device,
                    fromEvent(this.window, 'beforeunload'),
                    [ incomingLoggerMiddleware, communicationNotifierMiddleware ],
                    [ outgoingLoggerMiddleware, communicationNotifierMiddleware ]
                ).then((hub) => ({
                    hub,
                    communicationNotifierMiddleware
                }));
            }),
            switchMap(({ hub, communicationNotifierMiddleware }) => hub.properties.getPropertyValue$(HubProperty.primaryMacAddress).pipe(
                catchError((e: unknown) => hub.disconnect().pipe(switchMap(() => throwError(() => e)))),
                tap((macAddressReply) => {
                    communicationNotifierMiddleware.communicationNotifier$.pipe(
                        takeUntil(hub.disconnected$)
                    ).subscribe((v) => {
                        this.store.dispatch(HUBS_ACTIONS.setHasCommunication({ hubId: macAddressReply.macAddress, hasCommunication: v }));
                    });
                    this.hubStorage.store(hub, macAddressReply.macAddress);
                }),
                map((macAddressReply) => HUBS_ACTIONS.connected({ hubId: macAddressReply.macAddress, name: hub.name ?? '' })),
            )),
            catchError((error: unknown) => {
                if (error instanceof LpuConnectionError) {
                    return of(HUBS_ACTIONS.deviceConnectFailed({ error }));
                }
                return of(HUBS_ACTIONS.deviceConnectFailed({ error: this.lpuConnectionErrorFactory.createConnectionError() }));
            })
        );
    }
}
