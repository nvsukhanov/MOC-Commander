import { Injectable } from '@angular/core';
import { AttachedIoFeature } from './attached-io-feature';
import { InboundMessageListenerFactoryService } from '../inbound-message-listener-factory.service';
import { AttachedIoReplyParserService } from './attached-io-reply-parser.service';
import { Observable } from 'rxjs';
import { RawMessage } from '../raw-message';
import { MessageType } from '../../constants';

@Injectable()
export class AttachedIoFeatureFactoryService {
    constructor(
        private readonly messageListenerFactoryService: InboundMessageListenerFactoryService,
        private readonly replyParserService: AttachedIoReplyParserService
    ) {
    }

    public create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
    ): AttachedIoFeature {
        const repliesProvider = this.messageListenerFactoryService.create(
            characteristicDataStream,
            this.replyParserService,
            onHubDisconnected,
        );
        return new AttachedIoFeature(
            repliesProvider
        );
    }
}
