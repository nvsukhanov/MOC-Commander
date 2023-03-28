import { HubReply } from './hub-reply';
import { IHubMessageBody } from './i-hub-message-body';
import { HubMessage } from './hub-message';

export interface IHubDownstreamReplyParser {
    parseMessage(message: HubMessage<IHubMessageBody>): HubReply;
}
