import { Injectable } from '@angular/core';
import { LpuHubProperties } from './lpu-hub-properties';
import { HubDownstreamMessageDissectorService, HubDownstreamReplyParserService, HubPropertyUpstreamMessageFactoryService } from './messages';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging';

@Injectable({ providedIn: 'root' })
export class LpuHubPropertiesFactoryService {
    constructor(
        private readonly propertySubscriptionMessageBuilderService: HubPropertyUpstreamMessageFactoryService,
        private readonly replyParserService: HubDownstreamReplyParserService,
        private readonly logging: LoggingService,
        private readonly messageDissector: HubDownstreamMessageDissectorService
    ) {
    }

    public create(
        onHubDisconnected: Observable<void>,
        characteristic: BluetoothRemoteGATTCharacteristic,
        messenger: LpuCharacteristicsMessenger
    ): LpuHubProperties {
        return new LpuHubProperties(
            onHubDisconnected,
            this.propertySubscriptionMessageBuilderService,
            this.replyParserService,
            characteristic,
            messenger,
            this.logging,
            this.messageDissector
        );
    }
}
