import { MessageType, PortModeName } from '../constants';
import { InboundMessageListener, InboundMessageListenerFactoryService, PortValueReplyParserResolverService, RawMessage } from '../messages';
import { Observable } from 'rxjs';

export class IoFeaturePortValueListenerFactory {
    constructor(
        private readonly inboundMessageListenerFactoryService: InboundMessageListenerFactoryService,
        private readonly portValueReplyParserResolverService: PortValueReplyParserResolverService,
        private readonly characteristicDataStream: Observable<RawMessage<MessageType>>,
        private readonly onDisconnected$: Observable<void>,
    ) {
    }

    public createForMode(
        modeName: PortModeName
    ): InboundMessageListener<MessageType.portValueSingle> {
        const replyParserService = this.portValueReplyParserResolverService.resolve(modeName);
        if (!replyParserService) {
            throw new Error(`No reply parser for mode ${modeName}`);
        }
        return this.inboundMessageListenerFactoryService.create(
            this.characteristicDataStream,
            replyParserService,
            this.onDisconnected$,
        );
    }
}
