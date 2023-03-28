import { from, fromEvent, map, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';
import { HubMessageType, HubProperty, SubscribableHubProperties } from './constants';
import { PropertySubscriptionMessageBuilderService } from './property-subscription-message-builder.service';
import { ReplyParserService } from './reply-parsers';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';
import { LoggingService } from '../logging';

export class LpuHubProperties {
    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private notificationStarted = false;

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly characteristicReplies = new Observable<Uint8Array>((subscriber) => {
        const sub = fromEvent(this.primaryCharacteristic, this.characteristicValueChangedEventName).subscribe((e) => {
            const value = this.getValueFromEvent(e);
            if (value) {
                subscriber.next(value);
            }
        });
        return (): void => {
            sub?.unsubscribe();
        };
    }).pipe(
        shareReplay({ refCount: true })
    );

    public batteryLevel$ = new Observable<number | null>((subscriber) => {
        subscriber.next(null);

        const sub = from(this.subscribeToProperty(HubProperty.batteryVoltage)).pipe(
            switchMap(() => this.characteristicReplies),
            map((d) => this.replyParserService.parseMessage(d)),
        ).subscribe((d) => {
            if (!!d && d.type === HubMessageType.hubProperties && d.propertyType === HubProperty.batteryVoltage) {
                subscriber.next(d.level);
            }
        });

        return (): void => {
            sub.unsubscribe();
        };
    }).pipe(
        takeUntil(this.onHubDisconnected$),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    public rssiLevel$ = new Observable<number | null>((subscriber) => {
        subscriber.next(null);

        const sub = from(this.subscribeToProperty(HubProperty.rssi)).pipe(
            switchMap(() => this.characteristicReplies),
            map((d) => this.replyParserService.parseMessage(d)),
        ).subscribe((d) => {
            if (!!d && d.type === HubMessageType.hubProperties && d.propertyType === HubProperty.rssi) {
                subscriber.next(d.level);
            }
        });

        return (): void => {
            sub.unsubscribe();
        };
    }).pipe(
        takeUntil(this.onHubDisconnected$),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    public name$ = new Observable<string | null>((subscriber) => {
        subscriber.next(null);

        const sub = from(this.subscribeToProperty(HubProperty.name)).pipe(
            switchMap(() => this.characteristicReplies),
            map((d) => this.replyParserService.parseMessage(d)),
        ).subscribe((d) => {
            if (!!d && d.type === HubMessageType.hubProperties && d.propertyType === HubProperty.name) {
                subscriber.next(d.name);
            }
        });

        return (): void => {
            sub.unsubscribe();
        };
    }).pipe(
        takeUntil(this.onHubDisconnected$),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    constructor(
        private readonly onHubDisconnected$: Observable<void>,
        private readonly propertySubscriptionMessageBuilderService: PropertySubscriptionMessageBuilderService,
        private readonly replyParserService: ReplyParserService,
        private readonly primaryCharacteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messenger: LpuCharacteristicsMessenger,
        private readonly logging: LoggingService
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

    private async subscribeToProperty(characteristic: SubscribableHubProperties): Promise<void> {
        await this.ensureNotificationStarted();
        if (this.characteristicUnsubscribeHandlers.has(characteristic)) {
            return;
        }
        const message = this.propertySubscriptionMessageBuilderService.composeSubscribeMessage(characteristic);
        await this.messenger.send(message);
        this.characteristicUnsubscribeHandlers.set(characteristic, async (): Promise<void> => {
            this.propertySubscriptionMessageBuilderService.composeUnsubscribeMessage(characteristic);
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
}
