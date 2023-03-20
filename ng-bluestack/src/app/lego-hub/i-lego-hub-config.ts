import { InjectionToken } from '@angular/core';

export interface ILegoHubConfig {
    readonly maxGattConnectRetries: number;
}

export const LEGO_HUB_CONFIG = new InjectionToken<ILegoHubConfig>('LEGO_HUB_CONFIG', {
    providedIn: 'root',
    factory: (): ILegoHubConfig => ({ maxGattConnectRetries: 5 })
});
