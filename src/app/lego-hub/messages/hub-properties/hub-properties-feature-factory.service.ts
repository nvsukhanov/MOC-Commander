import { Injectable } from '@angular/core';
import { HubPropertiesFeature } from './hub-properties-feature';
import { OutboundMessenger } from '../outbound-messenger';
import { Observable } from 'rxjs';
import { LoggingService } from '../../../logging';
import { InboundMessageListenerFactoryService } from '../inbound-message-listener-factory.service';
import { HubPropertiesReplyParserService } from './hub-properties-reply-parser.service';
import { HubPropertiesOutboundMessageFactoryService } from './hub-properties-outbound-message-factory.service';
import { MessageType } from '../../constants';
import { RawMessage } from '../raw-message';

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
