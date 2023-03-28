import { IHubMessageBody } from '../i-hub-message-body';
import { HubMessageType, HubProperty } from '../../constants';

export class HubDownstreamPropertyMessageBody implements IHubMessageBody {
    public readonly messageType = HubMessageType.hubProperties;

    constructor(
        public readonly payload: Uint8Array
    ) {
    }

    public get hubProperty(): HubProperty {
        return this.payload[0];
    }

    public toString(): string {
        return this.payload.join(' ');
    }
}
