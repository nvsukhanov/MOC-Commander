import { Injectable } from '@angular/core';
import { ILogger } from '../../logging';
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
import { LpuConnectionErrorFactoryService } from '../errors';

@Injectable()
export class HubPropertiesFeatureFactoryService {
    constructor(
        private readonly featureMessageProviderFactoryService: InboundMessageListenerFactoryService,
        private readonly replyParserService: HubPropertiesReplyParserService,
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactoryService,
        private readonly errorsFactory: LpuConnectionErrorFactoryService
    ) {
    }

    public create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger,
        logger: ILogger
    ): HubPropertiesFeature {
        const repliesProvider = this.featureMessageProviderFactoryService.create(
            characteristicDataStream,
            this.replyParserService,
            onHubDisconnected,
        );
        return new HubPropertiesFeature(
            this.messageFactoryService,
            messenger,
            logger,
            repliesProvider,
            this.errorsFactory
        );
    }
}
