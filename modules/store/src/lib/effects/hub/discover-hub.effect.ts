import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { IHub, MessageLoggingMiddleware, connectHub } from 'rxpoweredup';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { APP_CONFIG, IAppConfig, NAVIGATOR, PrefixedConsoleLoggerFactoryService } from '@app/shared-misc';

import { SETTINGS_FEATURE } from '../../reducers';
import { HUBS_ACTIONS, HUB_RUNTIME_DATA_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';
import { HubCommunicationNotifierMiddlewareFactoryService } from '../../hub-communication-notifier-middleware-factory.service';

const USER_CANCELLED_DISCOVERY_ERROR_CODE = 8;

class UserCancelledDiscoveryError extends Error {
  public readonly code: number = USER_CANCELLED_DISCOVERY_ERROR_CODE;

  public override name = 'NotFoundError';

  constructor() {
    super('User cancelled the requestDevice() chooser.');
  }
}

function isUserCancelledDiscoveryError(error: unknown): error is UserCancelledDiscoveryError {
  if (error instanceof DOMException) {
    return (error as unknown as { code: unknown }).code === USER_CANCELLED_DISCOVERY_ERROR_CODE;
  }
  return false;
}

export const DISCOVER_HUB_EFFECT = createEffect(
  (
    actions$: Actions = inject(Actions),
    navigator: Navigator = inject(NAVIGATOR),
    communicationNotifierMiddlewareFactory: HubCommunicationNotifierMiddlewareFactoryService = inject(HubCommunicationNotifierMiddlewareFactoryService),
    prefixedConsoleLoggerFactory: PrefixedConsoleLoggerFactoryService = inject(PrefixedConsoleLoggerFactoryService),
    store: Store = inject(Store),
    hubStorage: HubStorageService = inject(HubStorageService),
    config: IAppConfig = inject(APP_CONFIG),
  ) => {
    return actions$.pipe(
      ofType(HUBS_ACTIONS.startDiscovery),
      concatLatestFrom(() => store.select(SETTINGS_FEATURE.selectUseLinuxCompat)),
      mergeMap(([, useLinuxWorkaround]) => {
        const incomingLoggerMiddleware = new MessageLoggingMiddleware(prefixedConsoleLoggerFactory.create('<'), 'all');
        const outgoingLoggerMiddleware = new MessageLoggingMiddleware(prefixedConsoleLoggerFactory.create('>'), 'all');
        const communicationNotifierMiddleware = communicationNotifierMiddlewareFactory.create();

        return connectHub(navigator.bluetooth, {
          incomingMessageMiddleware: [incomingLoggerMiddleware, communicationNotifierMiddleware],
          outgoingMessageMiddleware: [outgoingLoggerMiddleware, communicationNotifierMiddleware],
          messageSendTimeout: config.messageSendTimeout,
          maxMessageSendAttempts: config.maxMessageSendAttempts,
          initialMessageSendRetryDelayMs: config.initialMessageSendRetryDelayMs,
          defaultBufferMode: config.defaultBufferingMode,
          useLinuxWorkaround: !!useLinuxWorkaround,
        }).pipe(
          switchMap((hub: IHub) => {
            return of(hub).pipe(combineLatestWith(hub.properties.getPrimaryMacAddress(), hub.properties.getAdvertisingName()));
          }),
          map(([hub, macAddressReply, name]) => {
            if (hubStorage.has(macAddressReply)) {
              return HUBS_ACTIONS.alreadyConnected({ hubId: macAddressReply, name });
            }
            communicationNotifierMiddleware.communicationNotifier$.pipe(takeUntil(hub.disconnected)).subscribe((v) => {
              store.dispatch(HUB_RUNTIME_DATA_ACTIONS.setHasCommunication({ hubId: macAddressReply, hasCommunication: v }));
            });
            hubStorage.store(hub, macAddressReply);
            return HUBS_ACTIONS.connected({ hubId: macAddressReply, name });
          }),
          catchError((error: Error) => {
            if (isUserCancelledDiscoveryError(error)) {
              return of(HUBS_ACTIONS.discoveryCancelled());
            }
            return of(HUBS_ACTIONS.deviceConnectFailed({ error }));
          }),
        );
      }),
    );
  },
  { functional: true },
);
