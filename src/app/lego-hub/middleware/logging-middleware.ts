import { ILogger } from '../../logging';
import { IMessageMiddleware } from '../i-message-middleware';
import { RawMessage } from '../messages';
import { MessageType } from '../constants';

export class LoggingMiddleware implements IMessageMiddleware {
    private readonly logMessageTypesSet: ReadonlySet<MessageType>;

    constructor(
        private readonly logger: ILogger,
        private readonly logMessageTypes: MessageType[] | 'all'
    ) {
        this.logMessageTypesSet = new Set(logMessageTypes === 'all' ? [] : logMessageTypes);
    }

    public handle<T extends RawMessage<MessageType>>(message: T): T {
        if (this.logMessageTypes === 'all' || this.logMessageTypesSet.has(message.header.messageType)) {
            const messageData = this.formatMessageForDump(message);
            this.logger.debug(
                `message type '${messageData.messageType}',`,
                `payload ${messageData.payload}`
            );
        }
        return message;
    }

    private formatMessageForDump(message: RawMessage<MessageType>): { messageType: string, payload: string } { // TODO: deduplicate code
        const messageType = `${this.numberToHex(message.header.messageType)} (${MessageType[message.header.messageType]})`;
        const payload = [ ...message.payload ].map((v) => this.numberToHex(v)).join(' ');
        return { messageType, payload };
    }

    private numberToHex(number: number): string { // TODO: deduplicate code
        return `0x${number.toString(16).padStart(2, '0')}`;
    }
}
