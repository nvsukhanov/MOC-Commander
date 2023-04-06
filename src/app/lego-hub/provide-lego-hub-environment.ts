import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HubDiscoveryService } from './hub-discovery.service';
import { HubFactoryService } from './hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import {
    AttachedIoReplyParserService,
    CharacteristicDataStreamFactoryService,
    HubPropertiesOutboundMessageFactoryService,
    HubPropertiesReplyParserService,
    InboundMessageDissectorService,
    InboundMessageListenerFactoryService,
    OutboundMessengerFactoryService,
    PortInformationReplyParserService,
    PortInformationRequestOutboundMessageFactoryService,
    PortInputFormatSetupSingleOutboundMessageFactoryService,
    PortModeInformationReplyParserService,
    PortModeInformationRequestOutboundMessageFactoryService,
    PortOperationsOutboundMessageFactoryService,
    PortValueReplyParserService
} from './messages';
import { HubPropertiesFeatureFactoryService, IoFeatureFactoryService, MotorFeatureFactoryService } from './features';

export function provideLegoHubEnvironment(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            HubDiscoveryService,
            HubFactoryService,
            LpuConnectionErrorFactoryService,
            AttachedIoReplyParserService,
            HubPropertiesOutboundMessageFactoryService,
            HubPropertiesFeatureFactoryService,
            HubPropertiesReplyParserService,
            OutboundMessengerFactoryService,
            InboundMessageListenerFactoryService,
            InboundMessageDissectorService,
            IoFeatureFactoryService,
            PortInformationReplyParserService,
            PortInformationRequestOutboundMessageFactoryService,
            CharacteristicDataStreamFactoryService,
            PortValueReplyParserService,
            PortModeInformationRequestOutboundMessageFactoryService,
            PortModeInformationReplyParserService,
            MotorFeatureFactoryService,
            PortOperationsOutboundMessageFactoryService,
            PortInputFormatSetupSingleOutboundMessageFactoryService
        ]
    ]);
}
