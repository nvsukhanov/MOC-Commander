import { from, fromEvent, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';
import { HubMessageType, HubProperty, SubscribableHubProperties } from './constants';
import {
    HubDownstreamMessageDissectorService,
    HubDownstreamReplyParserService,
    HubMessage,
    HubPropertyDownstreamMessageBody,
    HubPropertyUpstreamMessageFactoryService
} from './messages';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';
import { LoggingService } from '../logging';

enum CharacteristicNotificationState {
    NotStarted,
    Starting,
    Started,
    Stopping,
}

export class LpuHubProperties {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.rssi);

    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private notificationState: CharacteristicNotificationState = CharacteristicNotificationState.NotStarted;

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly characteristicReplies = new Observable<HubMessage<HubPropertyDownstreamMessageBody>>((subscriber) => {
        const sub = fromEvent(this.primaryCharacteristic, this.characteristicValueChangedEventName).subscribe((event) => {
            const rawMessage = this.getValueFromEvent(event);
            if (rawMessage) {
                try {
                    subscriber.next(this.messageDissector.dissect(rawMessage));
                } catch (e) {
                    this.logging.debug(e, event);
                }
            }
        });
        return (): void => {
            sub?.unsubscribe();
        };
    }).pipe(
        shareReplay({ refCount: true })
    );

    constructor(
        private readonly onHubDisconnected$: Observable<void>,
        private readonly propertySubscriptionMessageBuilderService: HubPropertyUpstreamMessageFactoryService,
        private readonly replyParserService: HubDownstreamReplyParserService,
        private readonly primaryCharacteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messenger: LpuCharacteristicsMessenger,
        private readonly logging: LoggingService,
        private readonly messageDissector: HubDownstreamMessageDissectorService
    ) {
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
        this.notificationState = CharacteristicNotificationState.Stopping;
        try {
            await this.primaryCharacteristic.stopNotifications();
            this.notificationState = CharacteristicNotificationState.NotStarted;
        } catch (e) {
            this.notificationState = CharacteristicNotificationState.Started;
            throw e;
        }
    }

    public async startNotificationListening(): Promise<void> {
        if (this.notificationState === CharacteristicNotificationState.NotStarted) {
            this.logging.debug('Starting notifications listening');
            this.notificationState = CharacteristicNotificationState.Starting;
            try {
                await this.primaryCharacteristic.startNotifications();
                this.logging.debug('Notifications listening started');
                this.notificationState = CharacteristicNotificationState.Started;
            } catch (e) {
                this.notificationState = CharacteristicNotificationState.NotStarted;
                throw e;
            }
        }
    }

    private async sendSubscibeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
        await this.startNotificationListening();
        if (this.characteristicUnsubscribeHandlers.has(property)) {
            return;
        }
        const message = this.propertySubscriptionMessageBuilderService.createSubscriptionMessage(property);
        await this.messenger.send(message);
        this.characteristicUnsubscribeHandlers.set(property, async (): Promise<void> => {
            this.propertySubscriptionMessageBuilderService.createUnsubscriptionMessage(property);
            await this.messenger.send(message);
        });
    }

    private getValueFromEvent(event: Event): null | Uint8Array {
        const buffer = (event.target as BluetoothRemoteGATTCharacteristic).value?.buffer;
        if (!buffer) {
            return null;
        }
        return new Uint8Array(buffer);
    }

    private createPropertyStream(trackedProperty: SubscribableHubProperties): Observable<number | null> {
        return new Observable<number | null>((subscriber) => {
            subscriber.next(null);

            const sub = from(this.sendSubscibeMessage(trackedProperty)).pipe(
                switchMap(() => this.characteristicReplies),
            ).subscribe((message) => {
                const reply = this.replyParserService.parseMessage(message);
                if (!!reply && reply.type === HubMessageType.hubProperties && reply.propertyType === trackedProperty) {
                    subscriber.next(reply.level);
                }
            });

            return (): void => {
                this.logging.debug('unsubscribing from property stream', trackedProperty);
                sub.unsubscribe();
            };
        }).pipe(
            takeUntil(this.onHubDisconnected$),
            shareReplay({ refCount: true, bufferSize: 1 })
        );
    }
}
