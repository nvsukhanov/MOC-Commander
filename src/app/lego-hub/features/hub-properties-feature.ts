import { catchError, filter, from, map, Observable, share, switchMap, take, tap, timeout } from 'rxjs';
import { HubProperty, MAX_NAME_SIZE, MessageType, SubscribableHubProperties } from '../constants';
import { HubPropertiesOutboundMessageFactoryService, HubPropertyInboundMessage, InboundMessageListener, OutboundMessenger } from '../messages';
import { ILogger } from '../../logging';
import { LpuConnectionErrorFactoryService } from '../errors';

export class HubPropertiesFeature {
    public batteryLevel$ = this.createPropertyStream(HubProperty.batteryVoltage);

    public rssiLevel$ = this.createPropertyStream(HubProperty.RSSI);

    public buttonState$ = this.createPropertyStream(HubProperty.button);

    private readonly characteristicUnsubscribeHandlers = new Map<SubscribableHubProperties, () => Promise<void>>();

    private readonly maxGetPropertyRetries = 5;

    private readonly propertyRequestTimeoutMs = 500;

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
        return this.messenger.send(message);
    }

    public async disconnect(): Promise<void> {
        for (const unsubscribeHandler of this.characteristicUnsubscribeHandlers.values()) {
            await unsubscribeHandler();
        }
    }

    public getPropertyValue$<T extends HubProperty>(property: T): Observable<HubPropertyInboundMessage & { propertyType: T }> {
        return this.getPropertyValueWithRetries$(property, 0);
    }

    private async sendSubscribeMessage(
        property: SubscribableHubProperties
    ): Promise<void> {
        if (this.characteristicUnsubscribeHandlers.has(property)) {
            return;
        }
        const message = this.messageFactoryService.createSubscriptionMessage(property);
        this.messenger.send(message);
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

    private getPropertyValueWithRetries$<T extends HubProperty>(
        property: T,
        attempt: number
    ): Observable<HubPropertyInboundMessage & { propertyType: T }> {
        if (attempt > this.maxGetPropertyRetries) {
            throw this.errorsFactory.createUnableToGetPropertyError(property);
        }
        return new Observable<HubPropertyInboundMessage & { propertyType: T }>((subscriber) => {
            const sub = this.messageListener.replies$.pipe(
                filter((reply) => reply.propertyType === property),
                map((reply) => reply as HubPropertyInboundMessage & { propertyType: T }),
                take(1)
            ).subscribe((v) => {
                subscriber.next(v);
                subscriber.complete();
            });

            const message = this.messageFactoryService.requestPropertyUpdate(property);
            this.messenger.send(message);
            return () => sub.unsubscribe();
        }).pipe(
            timeout(this.propertyRequestTimeoutMs),
            catchError(() => this.getPropertyValueWithRetries$(property, attempt + 1))
        );
    }
}
