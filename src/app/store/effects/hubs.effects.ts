import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, filter, from, interval, map, mergeMap, Observable, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS } from '../actions';
import { LogLevel, NAVIGATOR } from '../../common';
import { Action, Store } from '@ngrx/store';
import { HubCommunicationNotifierMiddlewareFactoryService } from '../hub-communication-notifier-middleware-factory.service';
import { Router } from '@angular/router';
import { HUBS_SELECTORS, ROUTER_SELECTORS } from '../selectors';
import { connectHub, IHub, MessageLoggingMiddleware } from '@nvsukhanov/rxpoweredup';
import { PrefixedConsoleLogger } from '../../common/logging/prefixed-console-logger';
import { RoutesBuilderService } from '../../routing';

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
                    takeUntil(this.hubStorage.get(action.hubId).beforeDisconnect),
                    map((hubType) => HUBS_ACTIONS.hubTypeReceived({ hubId: action.hubId, hubType }))
                );
            })
        );
    });

    public listenToBatteryLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.hubBatteryPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getBatteryLevel()),
                map((batteryLevel) => HUBS_ACTIONS.batteryLevelReceived({ hubId: a.hubId, batteryLevel }))
            ))
        );
    });

    public listenToRssiLevelOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => interval(this.hubRSSIPollInterval).pipe(
                startWith(0),
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect),
                switchMap(() => this.hubStorage.get(a.hubId).properties.getRSSILevel()),
                map((RSSI) => HUBS_ACTIONS.rssiLevelReceived({ hubId: a.hubId, RSSI }))
            ))
        );
    });

    public navigateToHubsOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            tap((a) => this.router.navigate(this.routesBuilderService.hubView(a.hubId)))
        );
    }, { dispatch: false });

    public listerToButtonStateOnConnect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((a) => this.hubStorage.get(a.hubId).properties.buttonState.pipe(
                takeUntil(this.hubStorage.get(a.hubId).beforeDisconnect),
                map((isPressed) => HUBS_ACTIONS.buttonStateReceived({ hubId: a.hubId, isPressed }))
            ))
        );
    });

    public readonly listenDeviceDisconnect$ = createEffect(() => {
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
            mergeMap(([ action, hub ]) => {
                return from(this.hubStorage.get(action.hubId).disconnect()).pipe(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    map(() => HUBS_ACTIONS.disconnected({ hubId: hub!.hubId, name: hub!.name }))
                );
            })
        );
    });

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

    private readonly hubBatteryPollInterval = 20000; // TODO: move to config

    private readonly hubRSSIPollInterval = 5000; // TODO: move to config

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly router: Router,
        private readonly hubStorage: HubStorageService,
        private readonly communicationNotifierMiddlewareFactory: HubCommunicationNotifierMiddlewareFactoryService,
        @Inject(NAVIGATOR) private readonly navigator: Navigator,
        private readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    private hubDiscovery$(): Observable<Action> {
        const incomingLoggerMiddleware = new MessageLoggingMiddleware(new PrefixedConsoleLogger('<', LogLevel.Debug), 'all'); // TODO: replace w/ factory
        const outgoingLoggerMiddleware = new MessageLoggingMiddleware(new PrefixedConsoleLogger('>', LogLevel.Debug), 'all'); // TODO: replace w/ factory
        const communicationNotifierMiddleware = this.communicationNotifierMiddlewareFactory.create();

        return connectHub(
            this.navigator.bluetooth,
            {
                incomingMessageMiddleware: [ incomingLoggerMiddleware, communicationNotifierMiddleware ],
                outgoingMessageMiddleware: [ outgoingLoggerMiddleware, communicationNotifierMiddleware ],
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
                    this.store.dispatch(HUBS_ACTIONS.setHasCommunication({ hubId: macAddressReply, hasCommunication: v }));
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
