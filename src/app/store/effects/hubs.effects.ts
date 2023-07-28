import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, combineLatestWith, filter, from, interval, map, mergeMap, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IHub, MessageLoggingMiddleware, connectHub } from '@nvsukhanov/rxpoweredup';
import { APP_CONFIG, IAppConfig, NAVIGATOR, PrefixedConsoleLoggerFactoryService } from '@app/shared';

import { HubStorageService } from '../hub-storage.service';
import { HubCommunicationNotifierMiddlewareFactoryService } from '../hub-communication-notifier-middleware-factory.service';
import { HUBS_SELECTORS, ROUTER_SELECTORS } from '../selectors';
import { RoutesBuilderService } from '../../routing';
import { HUBS_ACTIONS, HUB_STATS_ACTIONS } from '../actions';

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
                return hub.properties.getSystemTypeId().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    map((hubType) => HUBS_ACTIONS.hubTypeReceived({ hubId: action.hubId, hubType }))
                );
            })
        );
    });

    public listenToBatteryLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.config.hubBatteryPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).disconnected),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getBatteryLevel()),
                map((batteryLevel) => HUB_STATS_ACTIONS.batteryLevelReceived({ hubId: a.hubId, batteryLevel }))
            ))
        );
    });

    public listenToRssiLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.config.hubRssiPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).disconnected),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getRSSILevel()),
                map((rssi) => HUB_STATS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, rssi }))
            ))
        );
    });

    public listerToButtonStateOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.get(a.hubId).properties.buttonState.pipe(
                takeUntil(this.hubStorage.get(a.hubId).disconnected),
                map((isButtonPressed) => HUB_STATS_ACTIONS.buttonStateReceived({ hubId: a.hubId, isButtonPressed }))
            ))
        );
    });

    public readonly listenHubDisconnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => this.hubStorage.get(action.hubId).disconnected.pipe(
                tap(() => {
                    this.hubStorage.removeHub(action.hubId);
                }),
                map(() => HUBS_ACTIONS.disconnected({ hubId: action.hubId, name: action.name }))
            )),
        );
    });

    public readonly userRequestedHubDisconnection$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.userRequestedHubDisconnection),
            concatLatestFrom((action) => this.store.select(HUBS_SELECTORS.selectHub(action.hubId))),
            filter(([ , hub ]) => !!hub),
            mergeMap(([ action ]) => this.hubStorage.get(action.hubId).disconnect())
        );
    }, { dispatch: false });

    public readonly setHubName$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.requestSetHubName),
            mergeMap((a) => from(this.hubStorage.get(a.hubId).properties.setHubAdvertisingName(a.name)).pipe(
                switchMap(() => this.hubStorage.get(a.hubId).properties.getAdvertisingName()),
                map((name) => HUBS_ACTIONS.hubNameSet({ hubId: a.hubId, name }))
            ))
        );
    });

    public readonly closeEditPageOnSaveCompleted$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.hubNameSet),
            concatLatestFrom(() => this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId)),
            filter(([ a, b ]) => a.hubId === b),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tap(([ , hubId ]) => this.router.navigate(this.routesBuilderService.hubView(hubId!)))
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly router: Router,
        private readonly hubStorage: HubStorageService,
        private readonly communicationNotifierMiddlewareFactory: HubCommunicationNotifierMiddlewareFactoryService,
        @Inject(NAVIGATOR) private readonly navigator: Navigator,
        private readonly routesBuilderService: RoutesBuilderService,
        @Inject(APP_CONFIG) private readonly config: IAppConfig,
        private readonly prefixedConsoleLoggerFactory: PrefixedConsoleLoggerFactoryService,
    ) {
    }

    private hubDiscovery$(): Observable<Action> {
        const incomingLoggerMiddleware = new MessageLoggingMiddleware(this.prefixedConsoleLoggerFactory.create('<'), 'all');
        const outgoingLoggerMiddleware = new MessageLoggingMiddleware(this.prefixedConsoleLoggerFactory.create('>'), 'all');
        const communicationNotifierMiddleware = this.communicationNotifierMiddlewareFactory.create();

        return connectHub(
            this.navigator.bluetooth,
            {
                incomingMessageMiddleware: [ incomingLoggerMiddleware, communicationNotifierMiddleware ],
                outgoingMessageMiddleware: [ outgoingLoggerMiddleware, communicationNotifierMiddleware ],
                messageSendTimeout: 200,
                maxMessageSendRetries: 10
            }
        ).pipe(
            switchMap((hub: IHub) => {
                return of(hub).pipe(
                    combineLatestWith(
                        hub.properties.getPrimaryMacAddress(),
                        hub.properties.getAdvertisingName()
                    )
                );
            }),
            tap(([ hub, macAddressReply ]) => {
                communicationNotifierMiddleware.communicationNotifier$.pipe(
                    takeUntil(hub.disconnected)
                ).subscribe((v) => {
                    this.store.dispatch(HUB_STATS_ACTIONS.setHasCommunication({ hubId: macAddressReply, hasCommunication: v }));
                });
                this.hubStorage.store(hub, macAddressReply);
            }),
            map(([ , macAddressReply, name ]) => HUBS_ACTIONS.connected({ hubId: macAddressReply, name })),
            catchError((error: Error) => {
                return of(HUBS_ACTIONS.deviceConnectFailed({ error }));
            })
        );
    }
}
