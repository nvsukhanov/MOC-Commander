import { InboundMessageListener } from './inbound-message-listener';
import { MessageType } from '../constants';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InboundMessageDissectorService } from './inbound-message-dissector.service';
import { IReplyParser } from './i-reply-parser';
import { LoggingService } from '../../logging';
import { RawMessage } from './raw-message';

@Injectable()
export class InboundMessageListenerFactoryService {
    constructor(
        private readonly dissector: InboundMessageDissectorService,
        private readonly logger: LoggingService,
    ) {
    }

    public create<TMessageType extends MessageType>(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        replyParserService: IReplyParser<TMessageType>,
        onDisconnected$: Observable<void>,
    ): InboundMessageListener<TMessageType> {
        return new InboundMessageListener<TMessageType>(
            characteristicDataStream,
            replyParserService,
            onDisconnected$,
            this.logger
        );
    }
}
