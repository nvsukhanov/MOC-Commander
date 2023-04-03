import { Inject, Injectable } from '@angular/core';
import { OutboundMessenger } from './outbound-messenger';
import { LoggingService } from '../../logging';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from '../i-lego-hub-config';

@Injectable()
export class OutboundMessengerFactoryService {
    constructor(
        private readonly logging: LoggingService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig,
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic
    ): OutboundMessenger {
        return new OutboundMessenger(
            characteristic,
            this.logging,
            this.config
        );
    }
}
