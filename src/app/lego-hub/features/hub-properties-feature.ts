import { filter, from, map, Observable, share, switchMap, tap } from 'rxjs';
import { HubProperty, MAX_NAME_SIZE, MessageType, SubscribableHubProperties } from '../constants';
import { HubPropertiesOutboundMessageFactoryService, HubPropertyInboundMessage, InboundMessageListener, OutboundMessenger } from '../messages';
import { ILogger } from '../../common';
import { LpuConnectionErrorFactoryService } from '../errors';

export class HubPropertiesFeature {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.RSSI);

    public buttonState$ = this.createPropertyStream(HubProperty.button);

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    constructor(
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger,
        private readonly logging: ILogger,
        private readonly messageListener: InboundMessageListener<MessageType.properties>,
        private readonly errorsFactory: LpuConnectionErrorFactoryService
    ) {
    }

    public setHubAdvertisingName(
        advertisingName: string
    ): Promise<void> {
        if (advertisingName.length > MAX_NAME_SIZE || advertisingName.length === 0) {
            throw this.errorsFactory.createInvalidPropertyValueError(HubProperty.advertisingName, advertisingName);
        }
        const charCodes = advertisingName.split('').map((char) => char.charCodeAt(0));
        const message = this.messageFactoryService.setProperty(HubProperty.advertisingName, charCodes);
        return this.messenger.sendWithoutResponse(message);
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
    }

    public getPropertyValue$<T extends HubProperty>(
        property: T
    ): Observable<HubPropertyInboundMessage & { propertyType: T }> {
        const message = this.messageFactoryService.requestPropertyUpdate(property);
        const replies = this.messageListener.replies$.pipe(
            filter((reply) => reply.propertyType === property),
            map((reply) => reply as HubPropertyInboundMessage & { propertyType: T }),
        );
        return this.messenger.sendAndReceive$(message, replies);
    }

    private async sendSubscribeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
        if (this.characteristicUnsubscribeHandlers.has(property)) {
            return;
        }
        const message = this.messageFactoryService.createSubscriptionMessage(property);
        this.messenger.sendWithoutResponse(message);
        this.characteristicUnsubscribeHandlers.set(property, async (): Promise<void> => {
            this.messageFactoryService.createUnsubscriptionMessage(property);
            await this.messenger.sendWithoutResponse(message);
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
                    this.messenger.sendWithoutResponse(message);
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
