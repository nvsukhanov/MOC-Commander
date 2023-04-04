import { filter, Observable, share } from 'rxjs';
import {
    InboundMessageListener,
    OutboundMessenger,
    PortInformationRequestOutboundMessageFactoryService,
    PortModeInformationInboundMessageTypes,
    PortModeInformationRequestOutboundMessageFactoryService
} from '../messages';
import { MessageType, PortModeInformationType } from '../constants';

export class IoFeature {
    public readonly attachedIoReplies$ = this.attachedIOInboundMessageListener.replies$.pipe(
        share()
    );

    public readonly portValueReplies$ = this.portValueInboundMessageListener.replies$.pipe(
        share()
    );

    public readonly portModeReplies$ = this.portModeInboundMessageListener.replies$.pipe(
        share()
    );

    public readonly portModeInformationReplies$ = this.portModeInformationInboundMessageListener.replies$.pipe(
        share()
    );

    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly portModeInboundMessageListener: InboundMessageListener<MessageType.portInformation>,
        private readonly portValueInboundMessageListener: InboundMessageListener<MessageType.portValueSingle>,
        private readonly attachedIOInboundMessageListener: InboundMessageListener<MessageType.attachedIO>,
        private readonly portModeInformationInboundMessageListener: InboundMessageListener<MessageType.portModeInformation>,
        private readonly portModeInformationOutboundMessageFactoryService: PortModeInformationRequestOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger
    ) {
    }

    public getPortModeInformationReplies$<T extends PortModeInformationType>(
        portId: number,
        mode: number,
        modeInformationType: T
    ): Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }> {
        return this.portModeInformationReplies$.pipe(
            filter((r) => r.portId === portId && r.mode === mode && r.modeInformationType === modeInformationType)
        ) as Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }>;
    }

    public requestPortModeInformation(
        portId: number,
        mode: number,
        modeInformationType: PortModeInformationType
    ): Promise<void> {
        return this.messenger.send(this.portModeInformationOutboundMessageFactoryService.createPortModeInformationRequest(
            portId,
            mode,
            modeInformationType
        ));
    }

    public requestPortValueInformation(
        portId: number
    ): Promise<void> {
        return this.messenger.send(this.messageFactoryService.createPortValueRequest(portId));
    }

    public requestPortMode(
        portId: number
    ): Promise<void> {
        return this.messenger.send(this.messageFactoryService.createPortModeRequest(portId));
    }
}
