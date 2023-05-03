import { exhaustMap, filter, Observable, share } from 'rxjs';
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
import { MessageType, PortModeInformationType, PortModeName } from '../constants';
import { AttachedIoRepliesCacheFactoryService } from './attached-io-replies-cache-factory.service';
import { IoFeaturePortValueListenerFactory } from './io-feature-port-value-listener-factory';

export class IoFeature {
    public readonly attachedIoReplies$: Observable<AttachedIOInboundMessage>;

    public readonly portModeReplies$ = this.portModeInboundMessageListener.replies$.pipe(
        share()
    );

    public readonly portModeInformationReplies$ = this.portModeInformationInboundMessageListener.replies$.pipe(
        share()
    );

    private portValueStreamMap = new Map<string, Observable<PortValueInboundMessage>>();

    private portValueModeState = new Map<number, number>();

    constructor(
        private readonly messageFactoryService: PortInformationRequestOutboundMessageFactoryService,
        private readonly portModeInboundMessageListener: InboundMessageListener<MessageType.portInformation>,
        private readonly portValueInboundListenerFactory: IoFeaturePortValueListenerFactory,
        private readonly attachedIOInboundMessageListener: InboundMessageListener<MessageType.attachedIO>,
        private readonly portModeInformationInboundMessageListener: InboundMessageListener<MessageType.portModeInformation>,
        private readonly portModeInformationOutboundMessageFactoryService: PortModeInformationRequestOutboundMessageFactoryService,
        private readonly portInputFormatSetupSingleOutboundMessageFactoryService: PortInputFormatSetupSingleOutboundMessageFactoryService,
        private readonly messenger: OutboundMessenger,
        private readonly attachedIoRepliesCacheFactoryService: AttachedIoRepliesCacheFactoryService,
        private readonly onDisconnected$: Observable<void>,
    ) {
        const cache = this.attachedIoRepliesCacheFactoryService.create(
            this.attachedIOInboundMessageListener.replies$,
            this.onDisconnected$,
        );
        this.attachedIoReplies$ = cache.replies$.pipe(
            share()
        );
    }

    public getPortValue$(
        portId: number,
        modeId: number,
        portModeName: PortModeName
    ): Observable<PortValueInboundMessage> {
        // ensure there are no active subscriptions for this port with different mode
        const existingPortModeState = this.portValueModeState.get(portId);
        if (existingPortModeState && existingPortModeState !== modeId) {
            throw new Error(`Unable to get port ${portId} mode values for mode ${modeId}:
             there are already active subscription for mode ${existingPortModeState}`);
        }

        // retrieve cached stream if any
        const portModeHash = `${portId}/${modeId}`;
        const existingStream = this.portValueStreamMap.get(portModeHash);
        if (existingStream) {
            return existingStream;
        }

        // will throw if no listener can be created for this mode
        const messageReplyListener = this.portValueInboundListenerFactory.createForMode(
            portModeName
        );

        const stream: Observable<PortValueInboundMessage> = new Observable((subscriber) => {
            const setPortInputFormatMessage = this.portInputFormatSetupSingleOutboundMessageFactoryService.createMessage(
                portId,
                modeId,
                false,
            );
            const portValueRequestMessage = this.messageFactoryService.createPortValueRequest(portId);

            // setting up port input format
            // since we have share() operator below, this will be executed only once per port/mode
            const sub = this.messenger.sendWithoutResponse$(setPortInputFormatMessage).pipe(
                // requesting port value
                // since we have share() operator below, this will be executed only once per port/mode
                exhaustMap(() => this.messenger.sendAndReceive$(portValueRequestMessage, messageReplyListener.replies$)),
            ).subscribe((v) => {
                this.portValueModeState.delete(portId);
                this.portValueStreamMap.delete(portModeHash);
                subscriber.next(v);
                subscriber.complete();
            });
            return () => {
                this.portValueModeState.delete(portId);
                this.portValueStreamMap.delete(portModeHash);
                sub.unsubscribe();
            };
        });

        const result = stream.pipe(share());
        // each new subscriptions will create guarded stream of replies and store it in cache
        this.portValueModeState.set(portId, modeId);
        this.portValueStreamMap.set(portModeHash, result);

        return result;
    }

    public getPortModes$(
        portId: number
    ): Observable<PortModeInboundMessage> {
        return this.messenger.sendAndReceive$(
            this.messageFactoryService.createPortModeRequest(portId),
            this.portModeReplies$.pipe(
                filter((r) => r.portId === portId)
            )
        );
    }

    public getPortModeInformation$<T extends PortModeInformationType>(
        portId: number,
        mode: number,
        modeInformationType: T
    ): Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }> {
        const portModeRequestMessage = this.portModeInformationOutboundMessageFactoryService.createPortModeInformationRequest(
            portId,
            mode,
            modeInformationType
        );

        const replies$ = (this.portModeInformationReplies$ as Observable<PortModeInformationInboundMessageTypes & { modeInformationType: T }>).pipe(
            filter((r) => r.modeInformationType === modeInformationType && r.portId === portId && r.mode === mode),
        );

        return this.messenger.sendAndReceive$(
            portModeRequestMessage,
            replies$
        );
    }
}
