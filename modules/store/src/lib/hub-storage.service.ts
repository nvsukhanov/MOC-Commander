import { Injectable } from '@angular/core';
import { IHub } from 'rxpoweredup';
import { ConsoleLoggingService } from '@app/shared-misc';

@Injectable()
export class HubStorageService {
    private hubsMap: Map<string, IHub> = new Map();

    constructor(
        private logger: ConsoleLoggingService
    ) {
    }

    public store(hub: IHub, id: string): void {
        if (this.hubsMap.has(id)) {
            throw new Error(`Hub with id=${id} is already registered`);
        }
        this.logger.debug('[HubStorage] Storing hub', id);
        this.hubsMap.set(id, hub);
    }

    public get(id: string): IHub {
        const hub = this.hubsMap.get(id);
        if (!hub) {
            throw new Error('Hub with id=${id} is not registered');
        }
        return hub;
    }

    public has(
        id: string
    ): boolean {
        return this.hubsMap.has(id);
    }

    public removeHub(id: string): void {
        this.logger.debug('[HubStorage] Removing hub from storage', id);
        this.hubsMap.delete(id);
    }
}
