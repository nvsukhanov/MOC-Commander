import { Injectable } from '@angular/core';
import { InboundMessageListener } from '../inbound-message-listener';
import { MessageType } from '../../constants';

@Injectable()
export class AttachedIoFeature {
    public readonly attachedIoReplies$ = this.messageListener.replies$;

    constructor(
        private readonly messageListener: InboundMessageListener<MessageType.attachedIO>
    ) {
    }
}
