import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Lpf2HubDiscoveryService } from './lpf2-hub-discovery.service';
import { Lpf2HubFactoryService } from './lpf2-hub-factory.service';
import { Lpf2HubStorageService } from './lpf2-hub-storage.service';
import { Lpf2ConnectionErrorFactoryService } from './errors';

export function provideLpf2(): EnvironmentProviders {
    return makeEnvironmentProviders([
        [
            Lpf2HubDiscoveryService,
            Lpf2HubFactoryService,
            Lpf2HubStorageService,
            Lpf2ConnectionErrorFactoryService
        ]
    ]);
}
