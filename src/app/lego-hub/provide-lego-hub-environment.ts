import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HubDiscoveryService } from './hub-discovery.service';
import { HubFactoryService } from './hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import { HubCharacteristicsMessengerFactoryService } from './hub-characteristics-messenger-factory.service';
import { HubPropertyProviderFactoryService } from './hub-property-provider-factory.service';
import {
    HubDownstreamAttachedIoMessageFactoryService,
    HubDownstreamAttachedIoReplyParser,
    HubDownstreamMessageDissectorFactoryService,
    HubDownstreamPropertiesReplyParserService,
    HubDownstreamPropertyMessageFactoryService,
    HubUpstreamPropertyMessageFactoryService
} from './messages';
import { HubAttachedIoProviderFactoryService } from './hub-attached-io-provider-factory.service';

export function provideLegoHubEnvironment(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            HubDiscoveryService,
            HubFactoryService,
            LpuConnectionErrorFactoryService,
            HubCharacteristicsMessengerFactoryService,
            HubPropertyProviderFactoryService,
            HubDownstreamPropertiesReplyParserService,
            HubDownstreamPropertyMessageFactoryService,
            HubUpstreamPropertyMessageFactoryService,
            HubDownstreamAttachedIoReplyParser,
            HubDownstreamMessageDissectorFactoryService,
            HubAttachedIoProviderFactoryService,
            HubDownstreamAttachedIoMessageFactoryService
        ]
    ]);
}
