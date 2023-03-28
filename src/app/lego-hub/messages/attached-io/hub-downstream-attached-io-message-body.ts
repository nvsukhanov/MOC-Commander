import { IHubMessageBody } from '../i-hub-message-body';
import { HubMessageType } from '../../constants';

export class HubDownstreamAttachedIoMessageBody implements IHubMessageBody {
    public readonly messageType = HubMessageType.hubAttachedIO;

    constructor(
        public readonly payload: Uint8Array
    ) {
    }

    public toString(): string {
        return this.payload.join(' ');
    }

}
