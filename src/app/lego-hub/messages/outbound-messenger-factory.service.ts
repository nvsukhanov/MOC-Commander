import { Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { IMessageMiddleware } from '../i-message-middleware';
import { ILogger } from '../../common';

@Injectable()
export class OutboundMessengerFactoryService {
    public create(
        characteristic: BluetoothRemoteGATTCharacteristic,
        messageMiddleware: IMessageMiddleware[],
        logger: ILogger
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            messageMiddleware,
            logger
        );
    }
}
