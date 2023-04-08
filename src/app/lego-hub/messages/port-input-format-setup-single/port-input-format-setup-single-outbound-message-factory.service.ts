import { Inject, Injectable } from '@angular/core';
import { MessageType } from '../../constants';
import { RawMessage } from '../raw-message';
import { numberToUint32LEArray } from '../../helpers';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from '../../i-lego-hub-config';

@Injectable()
export class PortInputFormatSetupSingleOutboundMessageFactoryService {
    private readonly defaultUnsubscribePortPollingInterval = 0xFFFFFFFF; // UInt32 max

    constructor(
        @Inject(LEGO_HUB_CONFIG) private config: ILegoHubConfig
    ) {
    }

    public createMessage(
        portId: number,
        mode: number,
        notificationsEnabled: boolean,
        deltaInterval: number = this.config.minimumAllowedIOPollInterval,
    ): RawMessage<MessageType.portInputFormatSetupSingle> {
        const pollInterval = notificationsEnabled
                             ? Math.max(deltaInterval, this.config.minimumAllowedIOPollInterval)
                             : this.defaultUnsubscribePortPollingInterval;
        return {
            header: {
                messageType: MessageType.portInputFormatSetupSingle,
            },
            payload: new Uint8Array([
                portId,
                mode,
                ...numberToUint32LEArray(pollInterval),
                +notificationsEnabled
            ])
        };
    }
}
