import { IMessageMiddleware, MessageType, RawMessage } from '@nvsukhanov/poweredup-api';
import { map, mergeWith, Observable, of, Subject, switchMap, timer } from 'rxjs';

export class HubCommunicationNotifierMiddleware implements IMessageMiddleware {
    public readonly communicationNotifier$: Observable<boolean>;

    private internalCommunicationNotifierSubject = new Subject<void>();

    private readonly communicationDebounceTime = 200;

    constructor() {
        this.communicationNotifier$ = this.internalCommunicationNotifierSubject.pipe(
            switchMap(() => of(true).pipe(
                mergeWith(timer(this.communicationDebounceTime).pipe(
                    map(() => false)
                ))
            ))
        );
    }

    public handle<T extends RawMessage<MessageType>>(message: T): T {
        this.internalCommunicationNotifierSubject.next();
        return message;
    }

}
