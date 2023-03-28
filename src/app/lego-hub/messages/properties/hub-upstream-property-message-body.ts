import { HubMessageType, HubPropertyOperation, PropertyAvailableForOperation } from '../../constants';
import { IHubMessageBody } from '../i-hub-message-body';

export class HubUpstreamPropertyMessageBody<TOperation extends HubPropertyOperation, TProperty extends PropertyAvailableForOperation<TOperation>>
    implements IHubMessageBody {
    public messageType = HubMessageType.hubProperties;

    public readonly payload: Uint8Array;

    constructor(
        public readonly hubOperation: TOperation,
        public readonly hubProperty: TProperty
    ) {
        this.payload = Uint8Array.from([
            this.hubProperty,
            this.hubOperation
        ]);
    }

    public toString(): string {
        return this.payload.join(' ');
    }
}
