import { Injectable } from '@angular/core';
import { PortValueAbsolutePositionReplyParserService } from './port-value-absolute-position-reply-parser.service';
import { MessageType, PortModeName } from '../../constants';
import { IReplyParser } from '../i-reply-parser';
import { PortValueSpeedReplyParserService } from './port-value-speed-reply-parser.service';

@Injectable()
export class PortValueReplyParserResolverService { // TODO: refactor to chain of responsibility
    private readonly portValueParsers: { [m in PortModeName]?: IReplyParser<MessageType.portValueSingle> } = {
        [PortModeName.absolutePosition]: this.portValueAbsolutePositionReplyParserService,
        [PortModeName.speed]: this.portValueSpeedReplyParserService
    };

    constructor(
        private readonly portValueAbsolutePositionReplyParserService: PortValueAbsolutePositionReplyParserService,
        private readonly portValueSpeedReplyParserService: PortValueSpeedReplyParserService,
    ) {
    }

    public resolve(
        modeName: PortModeName
    ): IReplyParser<MessageType.portValueSingle> | undefined {
        return this.portValueParsers[modeName];
    }
}
