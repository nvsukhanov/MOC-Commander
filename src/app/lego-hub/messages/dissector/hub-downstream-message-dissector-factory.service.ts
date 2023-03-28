import { Injectable } from '@angular/core';
import { IHubMessageBody } from '../i-hub-message-body';
import { HubDownstreamMessageDissector } from './hub-downstream-message-dissector';
import { IHubMessageFactory } from './i-hub-message-factory';

@Injectable()
export class HubDownstreamMessageDissectorFactoryService {
    public create<TBody extends IHubMessageBody>(
        factory: IHubMessageFactory<TBody>
    ): HubDownstreamMessageDissector<TBody> {
        return new HubDownstreamMessageDissector<TBody>(factory);
    }
}
