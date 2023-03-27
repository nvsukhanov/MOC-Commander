import { LoggingService } from '../logging';

export class LpuCharacteristicsMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly logging: LoggingService
    ) {
    }

    public send(
        payload: Uint8Array
    ): Promise<void> {
        const promise = this.queue.then(() => {
            this.logging.debug('sending', payload.join(' '));
            return this.characteristic.writeValue(payload);
        });
        this.queue = promise;
        return promise;
    }
}
