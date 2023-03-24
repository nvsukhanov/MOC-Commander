import { Injectable } from '@angular/core';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';

@Injectable()
export class LpuCharacteristicsMessengerFactoryService {
    public create(
        characteristic: BluetoothRemoteGATTCharacteristic
    ): LpuCharacteristicsMessenger {
        return new LpuCharacteristicsMessenger(characteristic);
    }
}
