import { from, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';
import { HubMessageType, HubProperty, SubscribableHubProperties } from './constants';
import {
    HubDownstreamMessageDissector,
    HubDownstreamPropertiesReplyParserService,
    HubDownstreamPropertyMessageBody,
    HubMessage,
    HubUpstreamPropertyMessageFactoryService
} from './messages';
import { HubCharacteristicsMessenger } from './hub-characteristics-messenger';
import { LoggingService } from '../logging';

export class HubPropertyProvider {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.rssi);

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly propertiesReplies = new Observable<HubMessage<HubDownstreamPropertyMessageBody>>((subscriber) => {
        const sub = this.characteristicDataStream.subscribe((rawMessage) => {
            if (!rawMessage || !this.messageDissector.messageTypeMatches(rawMessage)) {
                return;
            }
            try {
                subscriber.next(this.messageDissector.dissect(rawMessage));
            } catch (e) {
                this.logging.debug(e, rawMessage);
            }
        });
        return (): void => {
            sub?.unsubscribe();
        };
    }).pipe(
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    constructor(
        private readonly onHubDisconnected$: Observable<void>,
        private readonly propertySubscriptionMessageBuilderService: HubUpstreamPropertyMessageFactoryService,
        private readonly replyParserService: HubDownstreamPropertiesReplyParserService,
        private readonly characteristicDataStream: Observable<Uint8Array>,
        private readonly messenger: HubCharacteristicsMessenger,
        private readonly logging: LoggingService,
        private readonly messageDissector: HubDownstreamMessageDissector<HubDownstreamPropertyMessageBody>
    ) {
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
    }

    private async sendSubscibeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
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

    private createPropertyStream(trackedProperty: SubscribableHubProperties): Observable<number | null> {
        return new Observable<number | null>((subscriber) => {
            subscriber.next(null);

            const sub = from(this.sendSubscibeMessage(trackedProperty)).pipe(
                switchMap(() => this.propertiesReplies),
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
