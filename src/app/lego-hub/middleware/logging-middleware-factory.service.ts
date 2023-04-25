import { Injectable } from '@angular/core';
import { IMessageMiddleware } from '../i-message-middleware';
import { MessageType } from '../constants';
import { ILogger } from '../../logging';
import { LoggingMiddleware } from './logging-middleware';

@Injectable({ providedIn: 'root' })
export class LoggingMiddlewareFactoryService {
    public create(
        logger: ILogger,
        prefix: string,
        logMessageTypes: MessageType[] | 'all' = 'all'
    ): IMessageMiddleware {
        return new LoggingMiddleware(logger, prefix, logMessageTypes);
    }
}
