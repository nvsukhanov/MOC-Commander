import { filter, Observable, share, take } from 'rxjs';
import {
    AttachedIOInboundMessage,
    InboundMessageListener,
    OutboundMessenger,
    PortInformationRequestOutboundMessageFactoryService,
    PortInputFormatSetupSingleOutboundMessageFactoryService,
    PortModeInboundMessage,
    PortModeInformationInboundMessageTypes,
    PortModeInformationRequestOutboundMessageFactoryService,
    PortValueInboundMessage
} from '../messages';
import { MessageType, PortModeInformationType } from '../constants';

export class IoFeature {
    public readonly attachedIoReplies$: Observable<AttachedIOInboundMessage> = this.attachedIOInboundMessageListener.replies$.pipe(
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
        private readonly portInputFormatSetupSingleOutboundMessageFactoryService: PortInputFormatSetupSingleOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger
    ) {
    }

    public getPortValueUpdates$(
        portId: number
    ): Observable<PortValueInboundMessage> {
        return this.portValueReplies$.pipe(
            filter((d) => d.portId === portId)
        );
    }

    public setPortInputFormat(
        portId: number,
        mode: number,
        notificationEnabled: boolean,
        deltaInterval?: number,
    ): Promise<void> {
        return this.messenger.send(this.portInputFormatSetupSingleOutboundMessageFactoryService.createMessage(
            portId,
            mode,
            notificationEnabled,
            deltaInterval,
        ));
    }

    public getPortModeInformation$<T extends PortModeInformationType>(
        portId: number,
        mode: number,
        modeInformationType: T
    ): Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }> {
        this.requestPortModeInformation(portId, mode, modeInformationType);
        return (this.portModeInformationReplies$ as Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }>).pipe(
            filter((r) => r.modeInformationType === modeInformationType),
            take(1)
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

    public getPortModes$(portId: number): Observable<PortModeInboundMessage> {
        this.messenger.send(this.messageFactoryService.createPortModeRequest(portId));
        return this.portModeReplies$.pipe(
            filter((r) => r.portId === portId),
            take(1),
        );
    }
}
