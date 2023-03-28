import { HubMessage } from './index';
import { HubPropertyDownstreamMessageBody } from './hub-property-downstream-message-body';

export interface IHubDownstreamMessageFactory {
    createMessage(bodyPayload: Uint8Array): HubMessage<HubPropertyDownstreamMessageBody>;
}
