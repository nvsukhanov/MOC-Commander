import { filter, from, map, Observable, share, switchMap, tap } from 'rxjs';
import { HubProperty, MessageType, SubscribableHubProperties } from '../constants';
import { HubPropertiesOutboundMessageFactoryService, HubPropertyInboundMessage, InboundMessageListener, OutboundMessenger } from '../messages';
import { ILogger } from '../../logging';

export class HubPropertiesFeature {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.rssi);

    public buttonState$ = this.createPropertyStream(HubProperty.button);

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    constructor(
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger,
        private readonly logging: ILogger,
        private readonly messageListener: InboundMessageListener<MessageType.properties>
    ) {
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
    }

    public getPropertyValue$<T extends HubProperty>(property: T): Observable<HubPropertyInboundMessage & { propertyType: T }> {
        const message = this.messageFactoryService.requestPropertyUpdate(property);
        this.messenger.send(message);
        return this.messageListener.replies$.pipe(
            filter((reply) => reply.propertyType === property),
            map((reply) => reply as HubPropertyInboundMessage & { propertyType: T })
        );
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

    private createPropertyStream<T extends SubscribableHubProperties>(
        trackedProperty: T
    ): Observable<HubPropertyInboundMessage & { propertyType: T }> {
        return new Observable<HubPropertyInboundMessage & { propertyType: T }>((subscriber) => {
            this.logging.debug('subscribing to property stream', HubProperty[trackedProperty]);
            const sub = from(this.sendSubscribeMessage(trackedProperty)).pipe(
                tap(() => {
                    const message = this.messageFactoryService.requestPropertyUpdate(trackedProperty);
                    this.messenger.send(message);
                }),
                switchMap(() => this.messageListener.replies$),
                filter((reply) => reply.propertyType === trackedProperty),
            ).subscribe((message) => {
                subscriber.next(message as HubPropertyInboundMessage & { propertyType: T });
            });

            return (): void => {
                this.logging.debug('unsubscribing from property stream', HubProperty[trackedProperty]);
                sub.unsubscribe();
            };
        }).pipe(
            share()
        );
    }
}
