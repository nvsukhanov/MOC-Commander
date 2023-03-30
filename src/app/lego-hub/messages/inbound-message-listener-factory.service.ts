import { InboundMessageListener } from './inbound-message-listener';
import { MessageType } from '../constants';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InboundMessageDissectorService } from './inbound-message-dissector.service';
import { IReplyParser } from './i-reply-parser';

@Injectable()
export class InboundMessageListenerFactoryService {
    constructor(
        private readonly dissector: InboundMessageDissectorService,
    ) {
    }

    public create<TMessageType extends MessageType>(
        characteristic: BluetoothRemoteGATTCharacteristic,
        replyParserService: IReplyParser<TMessageType>,
        onDisconnected$: Observable<void>,
    ): InboundMessageListener<TMessageType> {
        return new InboundMessageListener<TMessageType>(
            characteristic,
            this.dissector,
            replyParserService,
            onDisconnected$,
        );
    }
}
