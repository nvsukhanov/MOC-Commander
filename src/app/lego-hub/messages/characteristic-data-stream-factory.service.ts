import { EMPTY, fromEvent, map, Observable, of, share, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { InboundMessageDissectorService, RawMessage } from './index';
import { MessageType } from '../constants';
import { LoggingService } from '../../logging';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from '../i-lego-hub-config';

@Injectable()
export class CharacteristicDataStreamFactoryService {
    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    private readonly dumpMessageTypesSet: ReadonlySet<MessageType>;

    constructor(
        private readonly dissector: InboundMessageDissectorService,
        private readonly logging: LoggingService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig,
    ) {
        this.dumpMessageTypesSet = new Set(this.config.dumpIncomingMessageType === 'all'
                                           ? []
                                           : this.config.dumpIncomingMessageType
        );
    }

    public create(characteristic: BluetoothRemoteGATTCharacteristic): Observable<RawMessage<MessageType>> {
        return fromEvent(characteristic, this.characteristicValueChangedEventName).pipe(
            map((e) => this.getValueFromEvent(e)),
            switchMap((value) => value ? of(value) : EMPTY),
            map((rawMessage) => this.dissector.dissect(rawMessage)),
            tap((message) => {
                if (this.config.dumpIncomingMessageType === 'all' || this.dumpMessageTypesSet.has(message.header.messageType)) {
                    this.logging.debug(
                        `Recieved message of type '${MessageType[message.header.messageType] ?? message.header.messageType}'`,
                        `with payload ${message.payload.join(' ')}`
                    );
                }
            }),
            share()
        );
    }

    private getValueFromEvent(event: Event): null | Uint8Array {
        const buffer = (event.target as BluetoothRemoteGATTCharacteristic).value?.buffer;
        if (!buffer) {
            return null;
        }
        return new Uint8Array(buffer);
    }
}
