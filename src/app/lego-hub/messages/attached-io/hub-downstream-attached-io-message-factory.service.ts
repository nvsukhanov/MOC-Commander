import { Injectable } from '@angular/core';
import { IHubMessageFactory } from '../dissector';
import { HubMessage } from '../hub-message';
import { HubDownstreamAttachedIoMessageBody } from './hub-downstream-attached-io-message-body';
import { HubMessageType } from '../../constants';

@Injectable()
export class HubDownstreamAttachedIoMessageFactoryService implements IHubMessageFactory<HubDownstreamAttachedIoMessageBody> {
    public readonly hubMessageType = HubMessageType.hubAttachedIO;

    public createMessage(bodyPayload: Uint8Array): HubMessage<HubDownstreamAttachedIoMessageBody> {
        return new HubMessage(
            new HubDownstreamAttachedIoMessageBody(bodyPayload)
        );
    }
}
