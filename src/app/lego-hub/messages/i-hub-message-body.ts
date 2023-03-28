import { HubMessageType } from '../constants';

export interface IHubMessageBody {
    readonly messageType: HubMessageType;

    readonly payload: Uint8Array;

    toString(): string;
}
