import { AttachedIOInboundMessage } from '../messages';
import { Observable, take, takeUntil, TeardownLogic } from 'rxjs';
import { AttachIoEvent } from '../constants';

export class AttachedIoRepliesCache {
    public readonly replies$: Observable<AttachedIOInboundMessage>;

    private cacheMap = new Map<number, AttachedIOInboundMessage>();

    constructor(
        private readonly messages$: Observable<AttachedIOInboundMessage>,
        private readonly onDisconnected$: Observable<void>,
    ) {
        this.replies$ = new Observable((observer) => {
            if (this.cacheMap.size) {
                [ ...this.cacheMap.values() ].forEach((message) => {
                    observer.next(message);
                });
            }
            const sub = this.messages$.subscribe((reply) => {
                observer.next(reply);
            });
            return (): TeardownLogic => sub.unsubscribe();
        });

        this.messages$.pipe(
            takeUntil(this.onDisconnected$)
        ).subscribe((reply) => this.addReply(reply));

        this.onDisconnected$.pipe(
            take(1)
        ).subscribe(() => this.cacheMap.clear());
    }

    private addReply(reply: AttachedIOInboundMessage): void {
        if (reply.event === AttachIoEvent.Detached) {
            this.cacheMap.delete(reply.portId);
        } else {
            this.cacheMap.set(reply.portId, reply);
        }
    }
}
