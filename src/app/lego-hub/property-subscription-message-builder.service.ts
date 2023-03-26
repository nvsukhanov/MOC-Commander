import { Injectable } from '@angular/core';
import { HubMessageType, HubPropertyAction, SubscribableHubProperties } from './constants';
import { MessageHeaderAppenderService } from './message-header-appender.service';

@Injectable()
export class PropertySubscriptionMessageBuilderService {
    constructor(
        private readonly messageHeaderAppenderService: MessageHeaderAppenderService
    ) {
    }

    public composeSubscribeMessage(property: SubscribableHubProperties): Uint8Array {
        const payload = Uint8Array.from([
            HubMessageType.hubProperties,
            property,
            HubPropertyAction.enableUpdates
        ]);

        return this.messageHeaderAppenderService.wrapPayload(payload);
    }

    public composeUnsubscribeMessage(property: SubscribableHubProperties): Uint8Array {
        const payload = Uint8Array.from([
            HubMessageType.hubProperties,
            property,
            HubPropertyAction.disableUpdates
        ]);

        return this.messageHeaderAppenderService.wrapPayload(payload);
    }

}
