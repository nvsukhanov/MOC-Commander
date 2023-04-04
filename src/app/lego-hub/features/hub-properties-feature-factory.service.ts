import { Injectable } from '@angular/core';
import { LoggingService } from '../../logging';
import {
    HubPropertiesOutboundMessageFactoryService,
    HubPropertiesReplyParserService,
    InboundMessageListenerFactoryService,
    OutboundMessenger,
    RawMessage
} from '../messages';
import { Observable } from 'rxjs';
import { MessageType } from '../constants';
import { HubPropertiesFeature } from './hub-properties-feature';

@Injectable()
export class HubPropertiesFeatureFactoryService {
    constructor(
        private readonly logging: LoggingService,
        private readonly featureMessageProviderFactoryService: InboundMessageListenerFactoryService,
        private readonly replyParserService: HubPropertiesReplyParserService,
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactoryService,
    ) {
    }

    public create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger,
    ): HubPropertiesFeature {
        const repliesProvider = this.featureMessageProviderFactoryService.create(
            characteristicDataStream,
            this.replyParserService,
            onHubDisconnected,
        );
        return new HubPropertiesFeature(
            this.messageFactoryService,
            messenger,
            this.logging,
            repliesProvider,
        );
    }
}
