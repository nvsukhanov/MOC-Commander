import { Injectable } from '@angular/core';
import { HubDownstreamPropertyMessageBody } from './hub-downstream-property-message-body';
import { HubMessage } from '../hub-message';
import { IHubMessageFactory } from '../dissector';
import { HubMessageType } from '../../constants';

@Injectable()
export class HubDownstreamPropertyMessageFactoryService implements IHubMessageFactory<HubDownstreamPropertyMessageBody> {
    public readonly hubMessageType = HubMessageType.hubProperties;

    public createMessage(bodyPayload: Uint8Array): HubMessage<HubDownstreamPropertyMessageBody> {
        return new HubMessage(
            new HubDownstreamPropertyMessageBody(bodyPayload)
        );
    }
}
