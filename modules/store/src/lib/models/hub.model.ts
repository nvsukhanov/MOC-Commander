import { HubType } from 'rxpoweredup';

export type HubModel = {
    hubId: string;
    name: string;
    hubType: HubType;
};

export enum HubDiscoveryState {
    Idle = 'Idle',
    Discovering = 'Discovering',
}
