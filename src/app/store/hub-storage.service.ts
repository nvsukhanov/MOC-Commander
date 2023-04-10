import { Injectable } from '@angular/core';
import { Hub, HubDiscoveryService } from '../lego-hub';

@Injectable()
export class HubStorageService {
    private hubsMap: Map<string, Hub> = new Map();

    constructor(
        private readonly lpuHubDiscoveryService: HubDiscoveryService,
    ) {
    }

    public async discoverHub(): Promise<Hub> {
        const hub = await this.lpuHubDiscoveryService.discoverHub();
        this.hubsMap.set(hub.id, hub);
        return hub;
    }

    public getHub(id: string): Hub {
        const hub = this.hubsMap.get(id);
        if (!hub) {
            throw new Error(`Hub with id=${id} is not registered`);
        }
        return hub;
    }

    public removeHub(id: string): void {
        this.hubsMap.delete(id);
    }
}
