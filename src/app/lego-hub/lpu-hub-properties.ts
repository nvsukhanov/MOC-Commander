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

export class LpuHubProperties {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.rssi);

    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private notificationStarted = false;

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly characteristicReplies = new Observable<HubMessage<HubPropertyDownstreamMessageBody>>((subscriber) => {
        const sub = fromEvent(this.primaryCharacteristic, this.characteristicValueChangedEventName).subscribe((e) => {
            const rawMessage = this.getValueFromEvent(e);
            if (rawMessage) {
                try {
                    subscriber.next(this.messageDissector.dissect(rawMessage));
                } catch (e) {
                    this.logging.debug(e);
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
        await this.primaryCharacteristic.stopNotifications();
        this.notificationStarted = false;
    }

    private async ensureNotificationStarted(): Promise<void> {
        if (!this.notificationStarted) {
            await this.primaryCharacteristic.startNotifications();
        }
        this.logging.debug('characteristic notifications started');
    }

    private async sendSubscibeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
        await this.ensureNotificationStarted();
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
