import { Injectable } from '@angular/core';

import { HubCommunicationNotifierMiddleware } from './hub-communication-notifier-middleware';

@Injectable({ providedIn: 'root' })
export class HubCommunicationNotifierMiddlewareFactoryService {
    public create(): HubCommunicationNotifierMiddleware {
        return new HubCommunicationNotifierMiddleware();
    }
}
