import { InjectionToken } from '@angular/core';
import { MessageType } from './constants';

export interface ILegoHubConfig {
    readonly maxGattConnectRetries: number;
    readonly dumpIncomingMessageType?: 'all' | ReadonlyArray<MessageType>
    readonly dumpOutgoingMessageType?: 'all' | ReadonlyArray<MessageType>;
}

export const LEGO_HUB_CONFIG = new InjectionToken<ILegoHubConfig>('LEGO_HUB_CONFIG', {
    providedIn: 'root',
    factory: (): ILegoHubConfig => ({ maxGattConnectRetries: 5 })
});
