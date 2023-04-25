import { InjectionToken } from '@angular/core';

export interface ILegoHubConfig {
    readonly maxGattConnectRetries: number;
    readonly minimumAllowedIOPollInterval: number;
}

const DEFAULT_CONFIG: ILegoHubConfig = {
    maxGattConnectRetries: 5,
    minimumAllowedIOPollInterval: 100
};

export function mergeConfig(config: Partial<ILegoHubConfig>): ILegoHubConfig {
    return {
        ...DEFAULT_CONFIG,
        ...config
    };
}

export const LEGO_HUB_CONFIG = new InjectionToken<ILegoHubConfig>('LEGO_HUB_CONFIG');
