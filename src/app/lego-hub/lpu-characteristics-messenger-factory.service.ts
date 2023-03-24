import { Injectable } from '@angular/core';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';
import { LoggingService } from '../logging';

@Injectable()
export class LpuCharacteristicsMessengerFactoryService {
    constructor(
        private readonly logging: LoggingService
    ) {
    }

    public create(
        characteristic: BluetoothRemoteGATTCharacteristic
    ): LpuCharacteristicsMessenger {
        return new LpuCharacteristicsMessenger(
            characteristic,
            this.logging
        );
    }
}
