import { MessageType } from '../constants';
import { RawMessage } from './raw-message';
import { IMessageMiddleware } from '../i-message-middleware';
import { catchError, Observable, retry, tap, timeout } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { InboundMessage } from './inbound-message';
import { ILogger } from '../../common';
import { concatUint8Arrays } from '../helpers';

export class OutboundMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    private readonly messageTypeLength = 1;

    private readonly defaultTimeout = 500;  // TODO: move to config

    private readonly defaultRetriesCount = 5; // TODO: move to config

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messageMiddleware: IMessageMiddleware[],
        private readonly logger: ILogger
    ) {
    }

    public send(
        message: RawMessage<MessageType>
    ): Promise<void> {
        const processedMessage = this.processMessageThroughMiddleware(message);
        const packet = this.buildPacket(processedMessage);
        return this.enqueuePacket(packet);
    }

    public send$(
        message: RawMessage<MessageType>,
    ): Observable<void> {
        return fromPromise(this.send(message));
    }

    public sendAndReceive$<TInboundMessage extends InboundMessage>(
        message: RawMessage<MessageType>,
        listener$: Observable<TInboundMessage>,
        timeoutMs: number = this.defaultTimeout,
        retries: number = this.defaultRetriesCount
    ): Observable<TInboundMessage> {
        const stream = new Observable<TInboundMessage>((subscriber) => {
            this.send(message);
            const sub = listener$.subscribe((message) => subscriber.next(message));
            return () => sub.unsubscribe();
        });
        let retryFired = false;
        return stream.pipe(
            timeout(timeoutMs),
            catchError((e) => {
                this.logger.warning(`Expected response for message of type ${message.header.messageType} was not received. Resending request...`);
                retryFired = true;
                throw e;
            }),
            retry(retries),
            tap(() => {
                if (retryFired) {
                    this.logger.warning(`Expected response for message of type ${message.header.messageType} was received after retrying`);
                }
            }),
            catchError((e) => {
                this.logger.warning(`Expected response for message of type ${message.header.messageType} was not received, giving up...`);
                throw e;
            })
        );
    }

    private processMessageThroughMiddleware(
        message: RawMessage<MessageType>
    ): RawMessage<MessageType> {
        return this.messageMiddleware.reduce((acc, middleware) => middleware.handle(acc), message);
    }

    private buildPacket(
        message: RawMessage<MessageType>
    ): Uint8Array {
        const header = this.composeHeader(message);
        return concatUint8Arrays(header, message.payload);
    }

    private enqueuePacket(
        message: Uint8Array
    ): Promise<void> {
        const promise = this.queue.then(() => {
            return this.characteristic.writeValueWithoutResponse(message);
        });
        this.queue = promise;
        return promise;
    }

    private composeHeader(
        message: RawMessage<MessageType>
    ): Uint8Array {
        if (this.getPayloadLengthPaddedWithMessageType(message) < 127) {
            return Uint8Array.from([ message.payload.byteLength, 0x00, message.header.messageType ]);
        } else {
            throw new Error('Long messages are not supported yet'); // TODO: add support
        }
    }

    private getPayloadLengthPaddedWithMessageType(
        message: RawMessage<MessageType>
    ): number {
        return message.payload.length + this.messageTypeLength;
    }
}
