import { HubMessage, HubPropertyDownstreamMessageBody } from './index';
import { HubReply } from './hub-reply';

export interface IHubDownstreamMessageValueParser {
    parseMessage(message: HubMessage<HubPropertyDownstreamMessageBody>): HubReply;
}
