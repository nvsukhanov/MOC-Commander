import { Observable } from 'rxjs';

export class Lpf2Device {
    constructor(
        public readonly onDisconnect$: Observable<void>,
        private readonly device: BluetoothRemoteGATTServer,
    ) {
    }
}
