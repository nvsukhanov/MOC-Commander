import { InjectionToken } from '@angular/core';
import { MessageType } from './constants';

export interface ILegoHubConfig {
    readonly maxGattConnectRetries: number;
    readonly dumpIncomingMessageType: 'all' | ReadonlyArray<MessageType>;
    readonly dumpOutgoingMessageType: 'all' | ReadonlyArray<MessageType>;
    readonly minimumAllowedIOPollInterval: number;
}

const DEFAULT_CONFIG: ILegoHubConfig = {
    maxGattConnectRetries: 5,
    dumpOutgoingMessageType: [],
    dumpIncomingMessageType: [],
    minimumAllowedIOPollInterval: 100
};

export function mergeConfig(config: Partial<ILegoHubConfig>): ILegoHubConfig {
    return {
        ...DEFAULT_CONFIG,
        ...config
    };
}

export const LEGO_HUB_CONFIG = new InjectionToken<ILegoHubConfig>('LEGO_HUB_CONFIG');
