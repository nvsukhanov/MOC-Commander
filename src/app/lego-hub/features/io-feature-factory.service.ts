import { Injectable } from '@angular/core';
import { IoFeature } from './io-feature';
import {
    AttachedIoReplyParserService,
    InboundMessageListenerFactoryService,
    OutboundMessenger,
    PortInformationReplyParserService,
    PortInformationRequestOutboundMessageFactoryService,
    PortModeInformationReplyParserService,
    PortModeInformationRequestOutboundMessageFactoryService,
    PortValueReplyParserService,
    RawMessage
} from '../messages';
import { Observable } from 'rxjs';
import { MessageType } from '../constants';

@Injectable()
export class IoFeatureFactoryService {
    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly inboundMessageListenerFactory: InboundMessageListenerFactoryService,
        private readonly portInformationRequestReplyParserService: PortInformationReplyParserService,
        private readonly portValueReplyParserService: PortValueReplyParserService,
        private readonly attachedIoReplyParserService: AttachedIoReplyParserService,
        private readonly portModeInformationOutboundMessageFactoryService: PortModeInformationRequestOutboundMessageFactoryService,
        private readonly portModeInformationReplyParserService: PortModeInformationReplyParserService,
    ) {
    }

    public create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger
    ): IoFeature {
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

        const attachedIOMessageListener = this.inboundMessageListenerFactory.create(
            characteristicDataStream,
            this.attachedIoReplyParserService,
            onHubDisconnected,
        );

        const portModeInformationMessageListener = this.inboundMessageListenerFactory.create(
            characteristicDataStream,
            this.portModeInformationReplyParserService,
            onHubDisconnected,
        );

        return new IoFeature(
            this.messageFactoryService,
            portInformationMessageListener,
            portValueMessageListener,
            attachedIOMessageListener,
            portModeInformationMessageListener,
            this.portModeInformationOutboundMessageFactoryService,
            messenger,
        );
    }
}
