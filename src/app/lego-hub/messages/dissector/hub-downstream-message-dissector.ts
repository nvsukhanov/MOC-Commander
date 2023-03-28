import { HubMessageType } from '../../constants';
import { HubMessage, IHubMessageBody } from '../index';
import { IHubMessageFactory } from './i-hub-message-factory';

export class HubDownstreamMessageDissector<TMessageBody extends IHubMessageBody> {
    private readonly messageTypeLength = 1;

    private readonly shortHeaderLength = 1;

    private readonly longHeaderLength = 2;

    private readonly hubIdLength = 1; // https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#common-message-header

    constructor(
        private readonly hubMessageFactory: IHubMessageFactory<TMessageBody>
    ) {
    }

    public messageTypeMatches(rawMessage: Uint8Array): boolean {
        const messageType = rawMessage[this.getMessageTypeOffset(rawMessage)] as HubMessageType;
        return messageType === this.hubMessageFactory.hubMessageType;
    }

    public dissect(rawMessage: Uint8Array): HubMessage<TMessageBody> {
        const messageType = rawMessage[this.getMessageTypeOffset(rawMessage)] as HubMessageType;
        if (messageType !== this.hubMessageFactory.hubMessageType) {
            throw new Error(`message type mismatch: expected ${this.hubMessageFactory.hubMessageType}, got ${messageType}`);
        }
        return this.hubMessageFactory.createMessage(this.getPayload(rawMessage));
    }

    private getPayload(message: Uint8Array): Uint8Array {
        return message.slice(
            this.getMessagePayloadOffset(message)
        );
    }

    private getMessageTypeOffset(message: Uint8Array): number {
        const headerLength = message[0] >= 127 ? this.longHeaderLength : this.shortHeaderLength;
        return headerLength + this.hubIdLength;
    }

    private getMessagePayloadOffset(message: Uint8Array): number {
        return this.getMessageTypeOffset(message) + this.messageTypeLength;
    }
}
