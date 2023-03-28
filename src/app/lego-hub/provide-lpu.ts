import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LpuHubDiscoveryService } from './lpu-hub-discovery.service';
import { LpuHubFactoryService } from './lpu-hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import { LpuCharacteristicsMessengerFactoryService } from './lpu-characteristics-messenger-factory.service';
import { LpuHubPropertiesFactoryService } from './lpu-hub-properties-factory.service';
import {
    HubDownstreamMessageDissectorService,
    HubDownstreamPropertiesValueParserService,
    HubDownstreamReplyParserService,
    HubPropertyDownstreamMessageFactoryService,
    HubPropertyUpstreamMessageFactoryService
} from './messages';

export function provideLpu(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            LpuHubDiscoveryService,
            LpuHubFactoryService,
            LpuConnectionErrorFactoryService,
            LpuCharacteristicsMessengerFactoryService,
            LpuHubPropertiesFactoryService,
            HubDownstreamReplyParserService,
            HubDownstreamMessageDissectorService,
            HubDownstreamPropertiesValueParserService,
            HubPropertyDownstreamMessageFactoryService,
            HubPropertyUpstreamMessageFactoryService
        ]
    ]);
}
