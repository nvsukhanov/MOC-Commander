import { Injectable } from '@angular/core';
import { MessageType, PortModeInformationType } from '../../constants';
import { RawMessage } from '../raw-message';

@Injectable()
export class PortModeInformationRequestOutboundMessageFactoryService {
    public createPortModeInformationRequest(
        portId: number,
        mode: number,
        modeInformationType: PortModeInformationType
    ): RawMessage<MessageType.portModeInformationRequest> {
        return {
            header: {
                messageType: MessageType.portModeInformationRequest,
            },
            payload: Uint8Array.from([
                portId,
                mode,
                modeInformationType
            ])
        };
    }
}
