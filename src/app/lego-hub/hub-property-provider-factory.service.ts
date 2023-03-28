import { Injectable } from '@angular/core';
import { HubPropertyProvider } from './hub-property-provider';
import {
    HubDownstreamMessageDissectorFactoryService,
    HubDownstreamPropertiesReplyParserService,
    HubDownstreamPropertyMessageFactoryService,
    HubUpstreamPropertyMessageFactoryService
} from './messages';
import { HubCharacteristicsMessenger } from './hub-characteristics-messenger';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging';

@Injectable()
export class HubPropertyProviderFactoryService {
    constructor(
        private readonly propertySubscriptionMessageBuilderService: HubUpstreamPropertyMessageFactoryService,
        private readonly replyParserService: HubDownstreamPropertiesReplyParserService,
        private readonly logging: LoggingService,
        private readonly messageDissectorFactory: HubDownstreamMessageDissectorFactoryService,
        private readonly downstreamPropertyMessageFactoryService: HubDownstreamPropertyMessageFactoryService
    ) {
    }

    public create(
        onHubDisconnected: Observable<void>,
        messenger: HubCharacteristicsMessenger,
        characteristicDataStream: Observable<Uint8Array>
    ): HubPropertyProvider {
        return new HubPropertyProvider(
            onHubDisconnected,
            this.propertySubscriptionMessageBuilderService,
            this.replyParserService,
            characteristicDataStream,
            messenger,
            this.logging,
            this.messageDissectorFactory.create(this.downstreamPropertyMessageFactoryService)
        );
    }
}
