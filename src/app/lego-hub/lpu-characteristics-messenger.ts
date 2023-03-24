import { LoggingService } from '../logging';

export class LpuCharacteristicsMessenger {
    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly logging: LoggingService
    ) {
    }

    public async send(
        payload: Uint8Array
    ): Promise<void> {
        this.logging.debug('sending', payload.join(' '));
        await this.characteristic.writeValueWithoutResponse(payload);
    }
}
