import { Injectable } from '@angular/core';
import { PortsFeature } from './ports-feature';
import { PortInformationRequestOutboundMessageFactoryService } from './port-information-request-outbound-message-factory.service';
import { PortInformationReplyParserService } from './port-information-reply-parser.service';
import { InboundMessageListenerFactoryService } from '../inbound-message-listener-factory.service';
import { Observable } from 'rxjs';
import { OutboundMessenger } from '../outbound-messenger';
import { RawMessage } from '../raw-message';
import { MessageType } from '../../constants';
import { PortValueReplyParserService } from './port-value-reply-parser.service';

@Injectable()
export class PortsFeatureFactoryService {
    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly inboundMessageListenerFactory: InboundMessageListenerFactoryService,
        private readonly portInformationRequestReplyParserService: PortInformationReplyParserService,
        private readonly portValueReplyParserService: PortValueReplyParserService,
    ) {
    }

    public create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger
    ): PortsFeature {
        const portInformationMessageListener = this.inboundMessageListenerFactory.create(
            characteristicDataStream,
            this.portInformationRequestReplyParserService,
            onHubDisconnected,
        );

        const portValueMessageListener = this.inboundMessageListenerFactory.create(
            characteristicDataStream,
            this.portValueReplyParserService,
            onHubDisconnected,
        );

        return new PortsFeature(
            this.messageFactoryService,
            portInformationMessageListener,
            portValueMessageListener,
            messenger,
        );
    }
}
