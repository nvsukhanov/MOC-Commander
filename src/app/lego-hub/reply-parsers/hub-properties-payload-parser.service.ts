import { Injectable } from '@angular/core';
import { HubPropertyReply, HubReply } from './hub-reply';
import { IReplyParser } from './i-reply-parser';
import { HubMessageTypes, HubProperties } from '../constants';

@Injectable()
export class HubPropertiesPayloadParserService implements IReplyParser {
    private readonly hubPropertyLength = 1;

    private readonly operationLength = 1;

    private readonly hubPropertiesParser: { [k in HubProperties]: (payload: Uint8Array) => HubPropertyReply | null } = {
        [HubProperties.batteryVoltage]: (v) => this.parseBatteryData(v),
        [HubProperties.name]: () => this.nullParser(),
        [HubProperties.rssi]: () => this.nullParser(),
    };

    public parse(payload: Uint8Array): HubReply | null {
        const hubProperty: HubProperties = payload[0];
        if (!this.hubPropertiesParser[hubProperty]) {
            console.warn('missing parser for property type', hubProperty); // TODO: proper logging
            return null;
        }
        const data = payload.slice(this.hubPropertyLength + this.operationLength);
        return this.hubPropertiesParser[hubProperty](data);
    }

    private parseBatteryData(payload: Uint8Array): HubPropertyReply | null {
        return {
            type: HubMessageTypes.hubProperties,
            propertyType: HubProperties.batteryVoltage,
            level: payload[0]
        };
    }

    private nullParser(): null {
        return null;
    }
}
