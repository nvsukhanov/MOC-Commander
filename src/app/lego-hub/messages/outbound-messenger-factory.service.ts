import { Inject, Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { ILogger } from '../../logging';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from '../i-lego-hub-config';

@Injectable()
export class OutboundMessengerFactoryService {
    constructor(
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig,
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic,
        logger: ILogger
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            logger,
            this.config
        );
    }
}
