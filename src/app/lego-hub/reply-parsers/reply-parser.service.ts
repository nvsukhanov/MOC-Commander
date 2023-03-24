import { Injectable } from '@angular/core';
import { HubReply } from './hub-reply';
import { MessageDissectorService } from './message-dissector.service';
import { HubMessageTypes } from '../constants';
import { IReplyParser } from './i-reply-parser';
import { HubPropertiesPayloadParserService } from './hub-properties-payload-parser.service';

@Injectable({ providedIn: 'root' })
export class ReplyParserService {
    private readonly messageTypeParsers: { [k in HubMessageTypes]: IReplyParser } = {
        [HubMessageTypes.hubProperties]: this.propertiesPayloadParserService
    };

    constructor(
        private mp: MessageDissectorService,
        private propertiesPayloadParserService: HubPropertiesPayloadParserService
    ) {
    }

    public parseMessage(message: Uint8Array): HubReply | null {
        console.log('recieved:', message.join(' '));
        const rawData = this.mp.parse(message);
        if (!rawData || !this.messageTypeParsers[rawData.messageType]) {
            return null;
        }
        return this.messageTypeParsers[rawData.messageType].parse(rawData.payload);
    }
}
