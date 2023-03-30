import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HubDiscoveryService } from './hub-discovery.service';
import { HubFactoryService } from './hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import {
    AttachedIoFeatureFactoryService,
    AttachedIoReplyParserService,
    HubPropertiesFeatureFactoryService,
    HubPropertiesOutboundMessageFactoryService,
    HubPropertiesReplyParserService,
    InboundMessageDissectorService,
    OutboundMessengerFactoryService,
    InboundMessageListenerFactoryService
} from './messages';

export function provideLegoHubEnvironment(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            HubDiscoveryService,
            HubFactoryService,
            LpuConnectionErrorFactoryService,
            AttachedIoFeatureFactoryService,
            AttachedIoReplyParserService,
            HubPropertiesOutboundMessageFactoryService,
            HubPropertiesFeatureFactoryService,
            HubPropertiesReplyParserService,
            OutboundMessengerFactoryService,
            InboundMessageListenerFactoryService,
            InboundMessageDissectorService
        ]
    ]);
}
