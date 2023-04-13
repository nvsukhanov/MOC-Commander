import { InboundMessageListener } from './inbound-message-listener';
import { MessageType } from '../constants';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IReplyParser } from './i-reply-parser';
import { RawMessage } from './raw-message';

@Injectable()
export class InboundMessageListenerFactoryService {
    public create<TMessageType extends MessageType>(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        replyParserService: IReplyParser<TMessageType>,
        onDisconnected$: Observable<void>,
    ): InboundMessageListener<TMessageType> {
        return new InboundMessageListener<TMessageType>(
            characteristicDataStream,
            replyParserService,
            onDisconnected$,
        );
    }
}
