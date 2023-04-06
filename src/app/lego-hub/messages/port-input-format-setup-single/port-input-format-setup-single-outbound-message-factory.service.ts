import { Injectable } from '@angular/core';
import { MessageType } from '../../constants';
import { RawMessage } from '../raw-message';
import { numberToUint32LEArray } from '../../helpers';

@Injectable()
export class PortInputFormatSetupSingleOutboundMessageFactoryService {
    public createMessage(
        portId: number,
        mode: number,
        deltaInterval: number,
        notificationsEnabled: boolean
    ): RawMessage<MessageType.portInputFormatSetupSingle> {
        return {
            header: {
                messageType: MessageType.portInputFormatSetupSingle,
            },
            payload: new Uint8Array([
                portId,
                mode,
                ...numberToUint32LEArray(deltaInterval),
                +notificationsEnabled
            ])
        };
    }
}
