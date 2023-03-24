import { Injectable } from '@angular/core';
import { LpuHub, LpuHubDiscoveryService } from '../lego-hub';

@Injectable()
export class LpuHubStorageService {
    private hub?: LpuHub;

    constructor(
        private readonly lpuHubDiscoveryService: LpuHubDiscoveryService,
    ) {
    }

    public async discoverHub(): Promise<void> {
        this.hub = await this.lpuHubDiscoveryService.discoverHub();
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
