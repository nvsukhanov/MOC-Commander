import { Observable } from 'rxjs';
import { HubPropertiesFeature, IoFeature, MotorFeature } from './features';

export class Hub {
    constructor(
        public readonly id: string,
        public readonly name: string | undefined,
        public readonly properties: HubPropertiesFeature,
        public readonly ports: IoFeature,
        public readonly motor: MotorFeature,
        public readonly beforeDisconnect$: Observable<void>,
        public readonly disconnected$: Observable<void>,
        public readonly disconnect: () => Observable<void>
    ) {
    }
}
