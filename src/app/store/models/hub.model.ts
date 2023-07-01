import { HubType } from '@nvsukhanov/rxpoweredup';

export type HubModel = {
    hubId: string;
    name: string;
    hubType: HubType;
}

export enum HubDiscoveryState {
    Idle = 'Idle',
    Discovering = 'Discovering',
}
