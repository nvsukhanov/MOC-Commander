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
    InboundMessageListenerFactoryService,
    OutboundMessengerFactoryService,
    PortInformationReplyParserService,
    PortInformationRequestOutboundMessageFactoryService,
    PortsFeatureFactoryService,
    PortValueReplyParserService
} from './messages';
import { CharacteristicDataStreamFactoryService } from './messages/characteristic-data-stream-factory.service';

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
            InboundMessageDissectorService,
            PortsFeatureFactoryService,
            PortInformationReplyParserService,
            PortInformationRequestOutboundMessageFactoryService,
            CharacteristicDataStreamFactoryService,
            PortValueReplyParserService
        ]
    ]);
}
