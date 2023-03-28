import { Injectable } from '@angular/core';
import { HubPropertyDownstreamMessageBody } from './hub-property-downstream-message-body';
import { HubMessage } from './hub-message';
import { IHubDownstreamMessageFactory } from './i-hub-downstream-message-factory';

@Injectable()
export class HubPropertyDownstreamMessageFactoryService implements IHubDownstreamMessageFactory {
    public createMessage(bodyPayload: Uint8Array): HubMessage<HubPropertyDownstreamMessageBody> {
        return new HubMessage(
            new HubPropertyDownstreamMessageBody(bodyPayload)
        );
    }
}
