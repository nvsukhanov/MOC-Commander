import { LoggingService } from '../logging';
import { HubMessage, IHubMessageBody } from './messages';

export class LpuCharacteristicsMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly logging: LoggingService
    ) {
    }

    public send(
        message: HubMessage<IHubMessageBody>
    ): Promise<void> {
        const rawMessage = message.getBuffer();
        const promise = this.queue.then(() => {
            this.logging.debug('sending', rawMessage);
            return this.characteristic.writeValue(rawMessage);
        });
        this.queue = promise;
        return promise;
    }
}
