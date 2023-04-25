import { Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { IMessageMiddleware } from '../i-message-middleware';

@Injectable()
export class OutboundMessengerFactoryService {
    public create(
        characteristic: BluetoothRemoteGATTCharacteristic,
        messageMiddleware: IMessageMiddleware[]
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            messageMiddleware
        );
    }
}
