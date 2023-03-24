import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LpuHubDiscoveryService } from './lpu-hub-discovery.service';
import { LpuHubFactoryService } from './lpu-hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';
import { LpuCharacteristicsMessengerFactoryService } from './lpu-characteristics-messenger-factory.service';
import { LpuHubPropertiesFactoryService } from './lpu-hub-properties-factory.service';
import { MessageHeaderAppenderService } from './message-header-appender.service';
import { PropertySubscriptionMessageBuilderService } from './property-subscription-message-builder.service';

export function provideLpu(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            LpuHubDiscoveryService,
            LpuHubFactoryService,
            LpuConnectionErrorFactoryService,
            LpuCharacteristicsMessengerFactoryService,
            LpuHubPropertiesFactoryService,
            MessageHeaderAppenderService,
            PropertySubscriptionMessageBuilderService
        ]
    ]);
}
