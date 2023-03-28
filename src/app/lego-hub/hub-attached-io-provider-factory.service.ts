import { Injectable } from '@angular/core';
import { HubDownstreamAttachedIoMessageFactoryService, HubDownstreamAttachedIoReplyParser, HubDownstreamMessageDissectorFactoryService } from './messages';
import { HubAttachedIoProvider } from './hub-attached-io-provider';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging';

@Injectable()
export class HubAttachedIoProviderFactoryService {
    constructor(
        private readonly dissectorFactoryService: HubDownstreamMessageDissectorFactoryService,
        private readonly messageFactoryService: HubDownstreamAttachedIoMessageFactoryService,
        private readonly logging: LoggingService,
        private readonly replyParserService: HubDownstreamAttachedIoReplyParser
    ) {
    }

    public create(
        onHubDisconnected: Observable<void>,
        characteristicDataStream: Observable<Uint8Array>
    ): HubAttachedIoProvider {
        return new HubAttachedIoProvider(
            onHubDisconnected,
            characteristicDataStream,
            this.logging,
            this.dissectorFactoryService.create(this.messageFactoryService),
            this.replyParserService
        );
    }
}
