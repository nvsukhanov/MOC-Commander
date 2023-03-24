import { from, fromEvent, map, Observable, shareReplay, Subscription, switchMap, takeUntil } from 'rxjs';
import { HubMessageTypes, HubProperties, SubscribableHubProperties } from './constants';
import { PropertySubscriptionMessageBuilderService } from './property-subscription-message-builder.service';
import { ReplyParserService } from './reply-parsers';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';

export class LpuHubProperties {
    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private notificationStarted = false;

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly characteristicReplies = new Observable<Uint8Array>((subscriber) => {
        let sub: Subscription;
        this.ensureNotificationStarted().then(() => {
            sub = fromEvent(this.primaryCharacteristic, this.characteristicValueChangedEventName).subscribe((e) => {
                const value = this.getValueFromEvent(e);
                if (value) {
                    subscriber.next(value);
                }
            });
        });
        return (): void => {
            sub?.unsubscribe;
        };
    }).pipe(
        shareReplay({ refCount: true })
    );

    public batteryLevel$ = new Observable<null | number>((subscriber) => {
        subscriber.next(null);

        const sub = from(this.subscribeToProperty(HubProperties.batteryVoltage)).pipe(
            switchMap(() => this.characteristicReplies),
            map((d) => this.replyParserService.parseMessage(d)),
        ).subscribe((d) => {
            if (!!d && d.type === HubMessageTypes.hubProperties && d.propertyType === HubProperties.batteryVoltage) {
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

    constructor(
        private readonly onHubDisconnected$: Observable<void>,
        private readonly propertySubscriptionMessageBuilderService: PropertySubscriptionMessageBuilderService,
        private readonly replyParserService: ReplyParserService,
        private readonly primaryCharacteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messenger: LpuCharacteristicsMessenger
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
        console.log('notifications started');
    }

    private async subscribeToProperty(characteristic: SubscribableHubProperties): Promise<void> {
        if (this.characteristicUnsubscribeHandlers.has(characteristic)) {
            return;
        }
        const message = this.propertySubscriptionMessageBuilderService.composeSubscribeMessage(HubProperties.batteryVoltage);
        await this.messenger.send(message);
        this.characteristicUnsubscribeHandlers.set(characteristic, async (): Promise<void> => {
            this.propertySubscriptionMessageBuilderService.composeUnsubscribeMessage(HubProperties.batteryVoltage);
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
