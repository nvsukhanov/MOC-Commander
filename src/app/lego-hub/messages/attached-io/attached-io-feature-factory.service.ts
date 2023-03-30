import { Injectable } from '@angular/core';
import { AttachedIoFeature } from './attached-io-feature';
import { InboundMessageListenerFactoryService } from '../inbound-message-listener-factory.service';
import { AttachedIoReplyParserService } from './attached-io-reply-parser.service';
import { Observable } from 'rxjs';

@Injectable()
export class AttachedIoFeatureFactoryService {
    constructor(
        private readonly messageListenerFactoryService: InboundMessageListenerFactoryService,
        private readonly replyParserService: AttachedIoReplyParserService
    ) {
    }

    public create(
        onHubDisconnected: Observable<void>,
        characteristic: BluetoothRemoteGATTCharacteristic
    ): AttachedIoFeature {
        const repliesProvider = this.messageListenerFactoryService.create(
            characteristic,
            this.replyParserService,
            onHubDisconnected,
        );
        return new AttachedIoFeature(
            repliesProvider
        );
    }
}
