import { MessageType } from '../constants';
import { EMPTY, filter, fromEvent, map, Observable, of, share, switchMap, takeUntil } from 'rxjs';
import { IReplyParser } from './i-reply-parser';
import { RawMessage } from './raw-message';
import { InboundMessageDissectorService } from './inbound-message-dissector.service';
import { InboundMessage } from './inbound-message';

export class InboundMessageListener<TMessageType extends MessageType> {
    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private readonly characteristicDataStream = fromEvent(this.characteristic, this.characteristicValueChangedEventName).pipe(
        map((e) => this.getValueFromEvent(e)),
        switchMap((value) => value ? of(value) : EMPTY),
        share()
    );

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly dissector: InboundMessageDissectorService,
        private readonly replyParserService: IReplyParser<TMessageType>,
        private readonly onDisconnected$: Observable<void>,
    ) {
    }

    public get replies$(): Observable<InboundMessage & { messageType: TMessageType }> {
        return this.characteristicDataStream.pipe(
            map((rawMessage) => this.dissector.dissect(rawMessage)),
            filter((message) => message.header.messageType === this.replyParserService.messageType),
            map((message) => this.replyParserService.parseMessage(message as RawMessage<TMessageType>)),
            takeUntil(this.onDisconnected$),
        );
    }

    private getValueFromEvent(event: Event): null | Uint8Array {
        const buffer = (event.target as BluetoothRemoteGATTCharacteristic).value?.buffer;
        if (!buffer) {
            return null;
        }
        return new Uint8Array(buffer);
    }
}
