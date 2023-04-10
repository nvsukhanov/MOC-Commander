import { IReplyParser } from '../i-reply-parser';
import { MessageType, PortModeInformationType } from '../../constants';
import {
    InboundMessage,
    PortModeInformationBase,
    PortModeInformationCapabilityBits,
    PortModeInformationMapping,
    PortModeInformationMotorBias,
    PortModeInformationName,
    PortModeInformationPctRange,
    PortModeInformationRawRange,
    PortModeInformationSiRange,
    PortModeInformationSymbol,
    PortModeInformationValueFormat
} from '../inbound-message';
import { RawMessage } from '../raw-message';
import { readBitAtPosition } from '../../helpers';
import { Injectable } from '@angular/core';

@Injectable()
export class PortModeInformationReplyParserService implements IReplyParser<MessageType.portModeInformation> {
    public readonly messageType = MessageType.portModeInformation;

    public parseMessage(
        message: RawMessage<MessageType.portModeInformation>
    ): InboundMessage & { messageType: MessageType.portModeInformation } {
        const baseMessageData: PortModeInformationBase = {
            portId: message.payload[0],
            mode: message.payload[1],
            messageType: MessageType.portModeInformation
        };
        const portModeInformationType = message.payload[2];
        switch (portModeInformationType) {
            case PortModeInformationType.name:
                return this.parsePortModeInformationName(message.payload, baseMessageData);
            case PortModeInformationType.rawRange:
                return this.parsePortModeInformationRawRange(message.payload, baseMessageData);
            case PortModeInformationType.pctRange:
                return this.parsePortModeInformationPctRange(message.payload, baseMessageData);
            case PortModeInformationType.siRange:
                return this.parsePortModeInformationSiRange(message.payload, baseMessageData);
            case PortModeInformationType.symbol:
                return this.parsePortModeInformationSymbol(message.payload, baseMessageData);
            case PortModeInformationType.mapping:
                return this.parsePortModeInformationMapping(message.payload, baseMessageData);
            case PortModeInformationType.motorBias:
                return this.parsePortModeInformationMotorBias(message.payload, baseMessageData);
            case PortModeInformationType.valueFormat:
                return this.parsePortModeInformationValueFormat(message.payload, baseMessageData);
            case PortModeInformationType.capabilityBits:
                return this.parsePortModeInformationCapabilityBits(message.payload, baseMessageData);
            default:
                throw new Error(`Unknown port mode information type: ${portModeInformationType}`);
        }
    }

    private parsePortModeInformationName(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationName {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.name,
            name: [ ...payload.slice(3) ].filter((v) => v).map((value) => String.fromCharCode(value)).join('')
        };
    }

    private parsePortModeInformationRawRange(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationRawRange {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.rawRange,
            rawMin: payload[3],
            rawMax: payload[4]
        };
    }

    private parsePortModeInformationPctRange(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationPctRange {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.pctRange,
            pctMin: payload[3],
            pctMax: payload[4]
        };
    }

    private parsePortModeInformationSiRange(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationSiRange {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.siRange,
            siMin: payload[3],
            siMax: payload[4]
        };
    }

    private parsePortModeInformationSymbol(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationSymbol {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.symbol,
            symbol: [ ...payload.slice(3) ].filter((v) => v).map((value) => String.fromCharCode(value)).join('')
        };
    }

    private parsePortModeInformationMapping(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationMapping {
        const inputSideValue = payload[3];
        const outputSideValue = payload[4];
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.mapping,
            inputSide: {
                supportsNull: readBitAtPosition(inputSideValue, 7),
                supportsFunctionalMapping: readBitAtPosition(inputSideValue, 6),
                abs: readBitAtPosition(inputSideValue, 4),
                rel: readBitAtPosition(inputSideValue, 3),
                dis: readBitAtPosition(inputSideValue, 2)
            },
            outputSide: {
                supportsNull: readBitAtPosition(outputSideValue, 7),
                supportsFunctionalMapping: readBitAtPosition(outputSideValue, 6),
                abs: readBitAtPosition(outputSideValue, 4),
                rel: readBitAtPosition(outputSideValue, 3),
                dis: readBitAtPosition(outputSideValue, 2)
            }
        };
    }

    private parsePortModeInformationMotorBias(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationMotorBias {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.motorBias,
            motorBias: payload[3]
        };
    }

    private parsePortModeInformationCapabilityBits(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationCapabilityBits {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.capabilityBits,
            capabilityBitsBE: [ ...payload.slice(3) ] as [ number, number, number, number, number, number ]
        };
    }

    private parsePortModeInformationValueFormat(payload: Uint8Array, baseMessage: PortModeInformationBase): PortModeInformationValueFormat {
        return {
            ...baseMessage,
            modeInformationType: PortModeInformationType.valueFormat,
            valueFormat: [ ...payload.slice(3) ] as [ number, number, number, number ]
        };
    }
}
