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
    PortValueAbsolutePositionReplyParserService,
    PortValueReplyParserResolverService,
    PortValueSpeedReplyParserService
} from './messages';
import { AttachedIoRepliesCacheFactoryService, HubPropertiesFeatureFactoryService, IoFeatureFactoryService, MotorFeatureFactoryService } from './features';
import { ILegoHubConfig, LEGO_HUB_CONFIG, mergeConfig } from './i-lego-hub-config';
import { HubLoggerFactoryService } from './logging';

export function provideLegoHubEnvironment(config: Partial<ILegoHubConfig> = {}): EnvironmentProviders {
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
            PortValueAbsolutePositionReplyParserService,
            PortModeInformationRequestOutboundMessageFactoryService,
            PortModeInformationReplyParserService,
            MotorFeatureFactoryService,
            PortOperationsOutboundMessageFactoryService,
            PortInputFormatSetupSingleOutboundMessageFactoryService,
            HubLoggerFactoryService,
            AttachedIoRepliesCacheFactoryService,
            PortValueReplyParserResolverService,
            PortValueSpeedReplyParserService,
            { provide: LEGO_HUB_CONFIG, useValue: mergeConfig(config) }
        ]
    ]);
}
