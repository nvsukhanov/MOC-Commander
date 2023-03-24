import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LpuHubDiscoveryService } from './lpu-hub-discovery.service';
import { LpuHubFactoryService } from './lpu-hub-factory.service';
import { LpuConnectionErrorFactoryService } from './errors';

export function provideLpu(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            LpuHubDiscoveryService,
            LpuHubFactoryService,
            LpuConnectionErrorFactoryService
        ]
    ]);
}
