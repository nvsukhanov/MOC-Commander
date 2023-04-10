import { Injectable } from '@angular/core';
import { HubProperty, HubPropertyOperation, MessageType, SubscribableHubProperties } from '../../constants';
import { RawMessage } from '../raw-message';

@Injectable()
export class HubPropertiesOutboundMessageFactoryService {
    public requestPropertyUpdate(property: HubProperty): RawMessage<MessageType.properties> {
        return {
            header: {
                messageType: MessageType.properties,
            },
            payload: Uint8Array.from([
                property,
                HubPropertyOperation.requestUpdate
            ])
        };
    }

    public createSubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): RawMessage<MessageType.properties> {
        return {
            header: {
                messageType: MessageType.properties,
            },
            payload: Uint8Array.from([
                property,
                HubPropertyOperation.enableUpdates
            ])
        };
    }

    public createUnsubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): RawMessage<MessageType.properties> {
        return {
            header: {
                messageType: MessageType.properties,
            },
            payload: Uint8Array.from([
                property,
                HubPropertyOperation.disableUpdates
            ])
        };
    }
}
