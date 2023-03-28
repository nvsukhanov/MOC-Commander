import { filter, map, Observable, shareReplay } from 'rxjs';
import { LoggingService } from '../logging';
import { HubDownstreamAttachedIoMessageBody, HubDownstreamAttachedIoReplyParser, HubDownstreamMessageDissector } from './messages';

export class HubAttachedIoProvider {

    public readonly attachedIoReplies = this.characteristicDataStream.pipe(
        filter((rawMessage) => this.dissector.messageTypeMatches(rawMessage)),
        map((rawMessage) => this.dissector.dissect(rawMessage)),
        map((message) => this.replyParserService.parseMessage(message)),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    constructor(
        private readonly onHubDisconnected$: Observable<void>,
        private readonly characteristicDataStream: Observable<Uint8Array>,
        private readonly logging: LoggingService,
        private readonly dissector: HubDownstreamMessageDissector<HubDownstreamAttachedIoMessageBody>,
        private readonly replyParserService: HubDownstreamAttachedIoReplyParser
    ) {
    }
}
