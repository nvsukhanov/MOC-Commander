import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType, PortInformationReplyType } from '../../constants';
import { InboundMessage, PortInformationModeInfoInboundMessage } from '../inbound-message';
import { RawMessage } from '../raw-message';
import { concatUint8ToUint16, readBitAtPosition } from '../../helpers';

@Injectable()
export class PortInformationReplyParserService implements IReplyParser<MessageType.portInformation> {
    public readonly messageType = MessageType.portInformation;

    public parseMessage(
        message: RawMessage<MessageType.portInformation>
    ): InboundMessage & { messageType: MessageType.portInformation } {
        const informationType: PortInformationReplyType = message.payload[1];
        switch (informationType) {
            case PortInformationReplyType.modeInfo:
                return this.parseInformationTypeReply(message);
            default:
                throw new Error(`Unknown port information reply type: ${informationType}`);
        }
    }

    private parseInformationTypeReply(
        message: RawMessage<MessageType.portInformation>
    ): PortInformationModeInfoInboundMessage {
        const capabilities = message.payload[2];
        const totalModeCount = message.payload[3];

        const inputModesValue = concatUint8ToUint16(message.payload[5], message.payload[4]);
        const inputModes: number[] = [];
        for (let i = 0; i < 15; i++) {
            if (readBitAtPosition(inputModesValue, i)) {
                inputModes.push(i);
            }
        }

        const outputModesValue = concatUint8ToUint16(message.payload[7], message.payload[6]);
        const outputModes: number[] = [];
        for (let i = 0; i < 15; i++) {
            if (readBitAtPosition(outputModesValue, i)) {
                outputModes.push(i);
            }
        }

        return {
            messageType: this.messageType,
            portId: message.payload[0],
            informationType: PortInformationReplyType.modeInfo,
            currentModeId: message.payload[1],
            capabilities: {
                output: readBitAtPosition(capabilities, 0),
                input: readBitAtPosition(capabilities, 1),
                logicalCombinable: readBitAtPosition(capabilities, 2),
                logicalSynchronizable: readBitAtPosition(capabilities, 3),
            },
            totalModeCount,
            inputModes,
            outputModes,
        };
    }

}
