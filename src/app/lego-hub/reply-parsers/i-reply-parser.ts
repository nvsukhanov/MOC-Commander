import { HubReply } from './hub-reply';

export interface IReplyParser {
    parse(payload: Uint8Array): HubReply | null;
}
