import { filter, from, Observable, share, switchMap } from 'rxjs';
import { HubProperty, MessageType, SubscribableHubProperties } from '../../constants';
import { OutboundMessenger } from '../outbound-messenger';
import { LoggingService } from '../../../logging';
import { InboundMessageListener } from '../inbound-message-listener';
import { HubPropertiesOutboundMessageFactoryService } from './hub-properties-outbound-message-factory.service';

export class HubPropertiesFeature {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.rssi);

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    constructor(
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger,
        private readonly logging: LoggingService,
        private readonly messageListener: InboundMessageListener<MessageType.properties>
    ) {
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
    }

    private async sendSubscribeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
        if (this.characteristicUnsubscribeHandlers.has(property)) {
            return;
        }
        const message = this.messageFactoryService.createSubscriptionMessage(property);
        await this.messenger.send(message);
        this.characteristicUnsubscribeHandlers.set(property, async (): Promise<void> => {
            this.messageFactoryService.createUnsubscriptionMessage(property);
            await this.messenger.send(message);
        });
    }

    private createPropertyStream(trackedProperty: SubscribableHubProperties): Observable<number | null> {
        return new Observable<number | null>((subscriber) => {
            subscriber.next(null);

            const sub = from(this.sendSubscribeMessage(trackedProperty)).pipe(
                switchMap(() => this.messageListener.replies$),
                filter((reply) => reply.propertyType === trackedProperty),
            ).subscribe((message) => {
                subscriber.next(message.level);
            });

            return (): void => {
                this.logging.debug('unsubscribing from property stream', trackedProperty);
                sub.unsubscribe();
            };
        }).pipe(
            share()
        );
    }
}
