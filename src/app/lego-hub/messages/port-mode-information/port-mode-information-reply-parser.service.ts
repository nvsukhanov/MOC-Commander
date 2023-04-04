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
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationName(message.payload)
                };
            case PortModeInformationType.rawRange:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationRawRange(message.payload)
                };
            case PortModeInformationType.pctRange:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationPctRange(message.payload)
                };
            case PortModeInformationType.siRange:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationSiRange(message.payload)
                };
            case PortModeInformationType.symbol:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationSymbol(message.payload)
                };
            case PortModeInformationType.mapping:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationMapping(message.payload)
                };
            case PortModeInformationType.motorBias:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationMotorBias(message.payload)
                };
            case PortModeInformationType.valueFormat:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationValueFormat(message.payload)
                };
            case PortModeInformationType.capabilityBits:
                return {
                    ...baseMessageData,
                    ...this.parsePortModeInformationCapabilityBits(message.payload)
                };
            default:
                throw new Error(`Unknown port mode information type: ${portModeInformationType}`);
        }
    }

    private parsePortModeInformationName(payload: Uint8Array): PortModeInformationName {
        return {
            modeInformationType: PortModeInformationType.name,
            name: [ ...payload.slice(3) ].filter((v) => v).map((value) => String.fromCharCode(value)).join('')
        };
    }

    private parsePortModeInformationRawRange(payload: Uint8Array): PortModeInformationRawRange {
        return {
            modeInformationType: PortModeInformationType.rawRange,
            rawMin: payload[3],
            rawMax: payload[4]
        };
    }

    private parsePortModeInformationPctRange(payload: Uint8Array): PortModeInformationPctRange {
        return {
            modeInformationType: PortModeInformationType.pctRange,
            pctMin: payload[3],
            pctMax: payload[4]
        };
    }

    private parsePortModeInformationSiRange(payload: Uint8Array): PortModeInformationSiRange {
        return {
            modeInformationType: PortModeInformationType.siRange,
            siMin: payload[3],
            siMax: payload[4]
        };
    }

    private parsePortModeInformationSymbol(payload: Uint8Array): PortModeInformationSymbol {
        return {
            modeInformationType: PortModeInformationType.symbol,
            symbol: [ ...payload.slice(3) ].filter((v) => v).map((value) => String.fromCharCode(value)).join('')
        };
    }

    private parsePortModeInformationMapping(payload: Uint8Array): PortModeInformationMapping {
        const inputSideValue = payload[3];
        const outputSideValue = payload[4];
        return {
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

    private parsePortModeInformationMotorBias(payload: Uint8Array): PortModeInformationMotorBias {
        return {
            modeInformationType: PortModeInformationType.motorBias,
            motorBias: payload[3]
        };
    }

    private parsePortModeInformationCapabilityBits(payload: Uint8Array): PortModeInformationCapabilityBits {
        return {
            modeInformationType: PortModeInformationType.capabilityBits,
            capabilityBitsBE: [ ...payload.slice(3) ] as [ number, number, number, number, number, number ]
        };
    }

    private parsePortModeInformationValueFormat(payload: Uint8Array): PortModeInformationValueFormat {
        return {
            modeInformationType: PortModeInformationType.valueFormat,
            valueFormat: [ ...payload.slice(3) ] as [ number, number, number, number ]
        };
    }
}
