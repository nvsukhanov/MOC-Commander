import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { InboundMessageListener } from '../inbound-message-listener';
import { MessageType } from '../../constants';
import { PortInformationRequestOutboundMessageFactoryService } from './port-information-request-outbound-message-factory.service';
import { PortModeInboundMessage, PortValueInboundMessage } from '../inbound-message';
import { OutboundMessenger } from '../outbound-messenger';

export class PortsFeature {
    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly portModeInboundMessageListener: InboundMessageListener<MessageType.portInformation>,
        private readonly portValueInboundMessageListener: InboundMessageListener<MessageType.portValue>,
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

    public listenForPortValue$(
        portId: number
    ): Observable<PortValueInboundMessage> {
        return this.portValueInboundMessageListener.replies$.pipe(
            // here and below we use switchMap to filter out messages that are not relevant to us
            // rxjs filter has a problem with type narrowing, so we use switchMap instead
            switchMap((m) => m.portId === portId ? of(m) : EMPTY
            ),
        );
    }

    public listenForPortMode$(
        portId: number
    ): Observable<PortModeInboundMessage> {
        return this.portModeInboundMessageListener.replies$.pipe(
            switchMap((m) => {
                    return m.portId === portId ? of(m) : EMPTY;
                }
            )
        );
    }
}
