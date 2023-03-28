import { Injectable } from '@angular/core';
import { Hub, HubDiscoveryService } from '../lego-hub';

@Injectable()
export class LpuHubStorageService {
    private hub?: Hub;

    constructor(
        private readonly lpuHubDiscoveryService: HubDiscoveryService,
    ) {
    }

    public async discoverHub(): Promise<void> {
        this.hub = await this.lpuHubDiscoveryService.discoverHub();
    }

    public getHub(): Hub {
        if (!this.hub) {
            throw new Error('Hub is not registered');
        }
        return this.hub;
    }

    public removeHub(): void {
        this.hub = undefined;
    }
}
