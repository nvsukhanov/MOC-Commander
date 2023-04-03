import { Injectable } from '@angular/core';
import { RawMessage } from '../raw-message';
import { MessageType, PortInformationRequestType } from '../../constants';

@Injectable()
export class PortInformationRequestOutboundMessageFactoryService {
    public createPortValueRequest(
        portId: number
    ): RawMessage<MessageType.portInformationRequest> {
        return {
            header: {
                messageType: MessageType.portInformationRequest,
            },
            payload: Uint8Array.from([
                portId,
                PortInformationRequestType.portValue
            ])
        };
    }

    public createPortModeRequest(
        portId: number
    ): RawMessage<MessageType.portInformationRequest> {
        return {
            header: {
                messageType: MessageType.portInformationRequest,
            },
            payload: Uint8Array.from([
                portId,
                PortInformationRequestType.modeInfo
            ])
        };
    }
}
