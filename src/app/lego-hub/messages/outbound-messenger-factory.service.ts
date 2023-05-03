import { Inject, Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { IMessageMiddleware } from '../i-message-middleware';
import { ExtractTokenType, ILogger } from '../../common';
import { LEGO_HUB_CONFIG } from '../i-lego-hub-config';

@Injectable()
export class OutboundMessengerFactoryService {
    constructor(
        @Inject(LEGO_HUB_CONFIG) private readonly config: ExtractTokenType<typeof LEGO_HUB_CONFIG>
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic,
        messageMiddleware: IMessageMiddleware[],
        logger: ILogger
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            messageMiddleware,
            logger,
            this.config
        );
    }
}
