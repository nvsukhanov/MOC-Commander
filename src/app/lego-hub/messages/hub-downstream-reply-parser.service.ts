import { Injectable } from '@angular/core';
import { HubReply } from './hub-reply';
import { HubMessageType } from '../constants';
import { HubDownstreamPropertiesValueParserService } from './hub-downstream-properties-value-parser.service';
import { HubMessage, HubPropertyDownstreamMessageBody } from './index';
import { IHubDownstreamMessageValueParser } from './i-hub-downstream-message-value-parser';

@Injectable()
export class HubDownstreamReplyParserService {
    private readonly messageTypeParsers: { [k in HubMessageType]: IHubDownstreamMessageValueParser } = {
        [HubMessageType.hubProperties]: this.propertiesPayloadParserService
    };

    constructor(
        private readonly propertiesPayloadParserService: HubDownstreamPropertiesValueParserService,
    ) {
    }

    public parseMessage(message: HubMessage<HubPropertyDownstreamMessageBody>): HubReply | null {
        return this.messageTypeParsers[message.hubMessageType].parseMessage(message);
    }
}
