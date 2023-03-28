import { Injectable } from '@angular/core';
import { HubMessage } from './hub-message';
import { HubPropertyOperation, SubscribableHubProperties } from '../constants';
import { HubPropertyUpstreamMessageBody } from './hub-property-upstream-message-body';

@Injectable()
export class HubPropertyUpstreamMessageFactoryService {
    public createSubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): HubMessage<HubPropertyUpstreamMessageBody<HubPropertyOperation.enableUpdates, TProp>> {
        return new HubMessage(new HubPropertyUpstreamMessageBody(HubPropertyOperation.enableUpdates, property));
    }

    public createUnsubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): HubMessage<HubPropertyUpstreamMessageBody<HubPropertyOperation.disableUpdates, SubscribableHubProperties>> {
        return new HubMessage(new HubPropertyUpstreamMessageBody(HubPropertyOperation.disableUpdates, property));
    }
}
