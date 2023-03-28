import { HubMessageType } from '../../constants';
import { IHubMessageBody } from '../i-hub-message-body';
import { HubMessage } from '../hub-message';

export interface IHubMessageFactory<TMessageBody extends IHubMessageBody> {
    readonly hubMessageType: HubMessageType;

    createMessage(bodyPayload: Uint8Array): HubMessage<TMessageBody>;
}
