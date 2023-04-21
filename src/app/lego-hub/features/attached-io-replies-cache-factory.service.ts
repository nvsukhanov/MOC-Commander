import { Injectable } from '@angular/core';
import { AttachedIoRepliesCache } from './attached-io-replies-cache';
import { Observable } from 'rxjs';
import { AttachedIOInboundMessage } from '../messages';

@Injectable()
export class AttachedIoRepliesCacheFactoryService {
    public create(
        messages$: Observable<AttachedIOInboundMessage>,
        onDisconnected$: Observable<void>,
    ): AttachedIoRepliesCache {
        return new AttachedIoRepliesCache(messages$, onDisconnected$);
    }
}
