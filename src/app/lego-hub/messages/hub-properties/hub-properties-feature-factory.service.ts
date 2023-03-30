import { Injectable } from '@angular/core';
import { HubPropertiesFeature } from './hub-properties-feature';
import { OutboundMessenger } from '../outbound-messenger';
import { Observable } from 'rxjs';
import { LoggingService } from '../../../logging';
import { InboundMessageListenerFactoryService } from '../inbound-message-listener-factory.service';
import { HubPropertiesReplyParserService } from './hub-properties-reply-parser.service';
import { HubPropertiesOutboundMessageFactoryService } from './hub-properties-outbound-message-factory.service';

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
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger,
        characteristic: BluetoothRemoteGATTCharacteristic
    ): HubPropertiesFeature {
        const repliesProvider = this.featureMessageProviderFactoryService.create(
            characteristic,
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
