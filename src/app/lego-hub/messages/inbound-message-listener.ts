import { MessageType } from '../constants';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { IReplyParser } from './i-reply-parser';
import { RawMessage } from './raw-message';
import { InboundMessage } from './inbound-message';

export class InboundMessageListener<TMessageType extends MessageType> {
    constructor(
        private readonly characteristicDataStream: Observable<RawMessage<MessageType>>,
        private readonly replyParserService: IReplyParser<TMessageType>,
        private readonly onDisconnected$: Observable<void>,
    ) {
    }

    public get replies$(): Observable<InboundMessage & { messageType: TMessageType }> {
        return this.characteristicDataStream.pipe(
            filter((message) => message.header.messageType === this.replyParserService.messageType),
            map((message) => this.replyParserService.parseMessage(message as RawMessage<TMessageType>)),
            takeUntil(this.onDisconnected$)
        );
    }
}
