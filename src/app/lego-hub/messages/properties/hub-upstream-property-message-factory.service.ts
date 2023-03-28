import { Injectable } from '@angular/core';
import { HubMessage } from '../hub-message';
import { HubPropertyOperation, SubscribableHubProperties } from '../../constants';
import { HubUpstreamPropertyMessageBody } from './hub-upstream-property-message-body';

@Injectable()
export class HubUpstreamPropertyMessageFactoryService {
    public createSubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): HubMessage<HubUpstreamPropertyMessageBody<HubPropertyOperation.enableUpdates, TProp>> {
        return new HubMessage(new HubUpstreamPropertyMessageBody(HubPropertyOperation.enableUpdates, property));
    }

    public createUnsubscriptionMessage<TProp extends SubscribableHubProperties>(
        property: TProp
    ): HubMessage<HubUpstreamPropertyMessageBody<HubPropertyOperation.disableUpdates, SubscribableHubProperties>> {
        return new HubMessage(new HubUpstreamPropertyMessageBody(HubPropertyOperation.disableUpdates, property));
    }
}
