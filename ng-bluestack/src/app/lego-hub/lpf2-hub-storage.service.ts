import { Injectable } from '@angular/core';
import { Lpf2Hub } from './lpf2-hub';

@Injectable()
export class Lpf2HubStorageService {
    private hub?: Lpf2Hub;

    public registerHub(
        hub: Lpf2Hub
    ): void {
        if (this.hub) {
            throw new Error('there is a hub that is already registered');
        }
        this.hub = hub;
    }

    public getHub(): Lpf2Hub {
        if (!this.hub) {
            throw new Error('Hub is not registered');
        }
        return this.hub;
    }

    public removeHub(): void {
        this.hub = undefined;
    }
}
