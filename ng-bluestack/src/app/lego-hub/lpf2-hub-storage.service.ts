import { Injectable } from '@angular/core';
import { Lpf2Device } from './lpf2-device';

@Injectable()
export class Lpf2HubStorageService {
    private hub?: Lpf2Device;

    public registerHub(hub: Lpf2Device): void {
        this.hub = hub;
    }

    public getGatt(): Lpf2Device {
        if (!this.hub) {
            throw new Error('Hub is not registered');
        }
        return this.hub;
    }

    public releaseHub(): void {
        this.hub = undefined;
    }
}
