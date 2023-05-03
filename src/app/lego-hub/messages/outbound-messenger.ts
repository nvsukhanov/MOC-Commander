import { MessageType } from '../constants';
import { RawMessage } from './raw-message';
import { IMessageMiddleware } from '../i-message-middleware';
import { catchError, firstValueFrom, from, Observable, retry, switchMap, tap, timeout } from 'rxjs';
import { InboundMessage } from './inbound-message';
import { ILogger } from '../../common';
import { concatUint8Arrays } from '../helpers';
import { ILegoHubConfig } from '../i-lego-hub-config';

export class OutboundMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    private readonly messageTypeLength = 1;

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messageMiddleware: IMessageMiddleware[],
        private readonly logger: ILogger,
        private readonly config: ILegoHubConfig
    ) {
    }

    public sendWithoutResponse(
        message: RawMessage<MessageType>
    ): Promise<void> {
        return this.enqueueOperation(this.createSendOperation(message));
    }

    public sendWithoutResponse$(
        message: RawMessage<MessageType>,
    ): Observable<void> {
        return from(this.sendWithoutResponse(message));
    }

    public sendAndReceive$<TInboundMessage extends InboundMessage>(
        message: RawMessage<MessageType>,
        listener$: Observable<TInboundMessage>
    ): Observable<TInboundMessage> {
        const stream = new Observable<TInboundMessage>((subscriber) => {

            const sendOp = this.createSendOperation(message);

            const sub = from(sendOp()).pipe(
                switchMap(() => listener$)
            ).subscribe((message) => {
                subscriber.next(message);
                subscriber.complete();
                sub.unsubscribe();
            });
            return () => sub.unsubscribe();
        });
        let retryFired = false;
        const request = stream.pipe(
            timeout(this.config.outboundMessageReplyTimeout),
            catchError((e) => {
                this.logger.warning(`Expected response for message of type ${message.header.messageType} was not received. Resending request...`);
                retryFired = true;
                throw e;
            }),
            retry(this.config.outboundMessageRetriesCount),
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

        return from(this.enqueueOperation(() => firstValueFrom(request)));
    }

    private createSendOperation(
        message: RawMessage<MessageType>
    ): () => Promise<void> {
        return (): Promise<void> => {
            this.messageMiddleware.reduce((acc, middleware) => middleware.handle(acc), message);
            const header = this.composeHeader(message);
            const packet = concatUint8Arrays(header, message.payload);
            return this.characteristic.writeValueWithoutResponse(packet);
        };
    }

    private enqueueOperation<T>(
        op: () => Promise<T>
    ): Promise<T> {
        const promise = this.queue.then(() => op());
        this.queue = promise.catch((e) => {
            this.logger.error(e);
        });
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
