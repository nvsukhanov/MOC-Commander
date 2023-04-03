import { Observable } from 'rxjs';
import { PortInformationRequestOutboundMessageFactoryService } from './port-information-request-outbound-message-factory.service';
import { PortInformationInboundMessageTypes, PortValueInboundMessage } from '../inbound-message';
import { OutboundMessenger } from '../outbound-messenger';
import { MessageType } from '../../constants';
import { InboundMessageListener } from '../inbound-message-listener';

export class PortsFeature {
    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly portModeInboundMessageListener: InboundMessageListener<MessageType.portInformation>,
        private readonly portValueInboundMessageListener: InboundMessageListener<MessageType.portValueSingle>,
        private readonly messenger: OutboundMessenger
    ) {
    }

    public requestPortValueInformation(
        portId: number
    ): Promise<void> {
        return this.messenger.send(this.messageFactoryService.createPortValueRequest(portId));
    }

    public requestPortModeInformation(
        portId: number
    ): Promise<void> {
        return this.messenger.send(this.messageFactoryService.createPortModeRequest(portId));
    }

    public listenAllPortValues$(): Observable<PortValueInboundMessage> {
        return this.portValueInboundMessageListener.replies$;
    }

    public listenAllPortModes$(): Observable<PortInformationInboundMessageTypes> {
        return this.portModeInboundMessageListener.replies$;
    }
}
