import { Injectable } from '@angular/core';
import { HubReply } from './hub-reply';
import { MessageDissectorService } from './message-dissector.service';
import { HubMessageTypes } from '../constants';
import { IReplyParser } from './i-reply-parser';
import { HubPropertiesPayloadParserService } from './hub-properties-payload-parser.service';
import { LoggingService } from '../../logging';

@Injectable()
export class ReplyParserService {
    private readonly messageTypeParsers: { [k in HubMessageTypes]: IReplyParser } = {
        [HubMessageTypes.hubProperties]: this.propertiesPayloadParserService
    };

    constructor(
        private readonly mp: MessageDissectorService,
        private readonly propertiesPayloadParserService: HubPropertiesPayloadParserService,
        private readonly logging: LoggingService
    ) {
    }

    public parseMessage(message: Uint8Array): HubReply | null {
        this.logging.debug('parsing reply:', message.join(' '));
        const rawData = this.mp.parse(message);
        if (!rawData || !this.messageTypeParsers[rawData.messageType]) {
            return null;
        }
        this.logging.debug('using parser', this.messageTypeParsers[rawData.messageType]);
        return this.messageTypeParsers[rawData.messageType].parse(rawData.payload);
    }
}
