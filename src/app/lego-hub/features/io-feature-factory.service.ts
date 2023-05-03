import { Injectable } from '@angular/core';
import { IoFeature } from './io-feature';
import {
    AttachedIoReplyParserService,
    InboundMessageListenerFactoryService,
    OutboundMessenger,
    PortInformationReplyParserService,
    PortInformationRequestOutboundMessageFactoryService,
    PortInputFormatSetupSingleOutboundMessageFactoryService,
    PortModeInformationReplyParserService,
    PortModeInformationRequestOutboundMessageFactoryService,
    PortValueReplyParserResolverService,
    RawMessage
} from '../messages';
import { Observable } from 'rxjs';
import { MessageType } from '../constants';
import { AttachedIoRepliesCacheFactoryService } from './attached-io-replies-cache-factory.service';
import { IoFeaturePortValueListenerFactory } from './io-feature-port-value-listener-factory';

@Injectable()
export class IoFeatureFactoryService {
    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly inboundMessageListenerFactory: InboundMessageListenerFactoryService,
        private readonly portInformationRequestReplyParserService: PortInformationReplyParserService,
        private readonly attachedIoReplyParserService: AttachedIoReplyParserService,
        private readonly portModeInformationOutboundMessageFactoryService: PortModeInformationRequestOutboundMessageFactoryService,
        private readonly portInputFormatSetupSingleOutboundMessageFactoryService: PortInputFormatSetupSingleOutboundMessageFactoryService,
        private readonly portModeInformationReplyParserService: PortModeInformationReplyParserService,
        private readonly attachedIoRepliesCacheFactoryService: AttachedIoRepliesCacheFactoryService,
        private readonly portValueReplyParserResolverService: PortValueReplyParserResolverService
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

        const portValueListenerFactory = new IoFeaturePortValueListenerFactory(
            this.inboundMessageListenerFactory,
            this.portValueReplyParserResolverService,
            characteristicDataStream,
            onHubDisconnected
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
            portValueListenerFactory,
            attachedIOMessageListener,
            portModeInformationMessageListener,
            this.portModeInformationOutboundMessageFactoryService,
            this.portInputFormatSetupSingleOutboundMessageFactoryService,
            messenger,
            this.attachedIoRepliesCacheFactoryService,
            onHubDisconnected,
        );
    }
}
