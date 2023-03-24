import { Injectable } from '@angular/core';
import { LpuHub } from './lpu-hub';

@Injectable()
export class LpuHubStorageService {
    private hub?: LpuHub;

    public registerHub(
        hub: LpuHub
    ): void {
        if (this.hub) {
            throw new Error('there is a hub that is already registered');
        }
        this.hub = hub;
    }

    public getHub(): LpuHub {
        if (!this.hub) {
            throw new Error('Hub is not registered');
        }
        return this.hub;
    }

    public removeHub(): void {
        this.hub = undefined;
    }
}
