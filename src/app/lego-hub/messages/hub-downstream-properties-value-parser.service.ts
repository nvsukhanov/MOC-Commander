import { Injectable } from '@angular/core';
import { HubPropertyReply, HubReply } from './hub-reply';
import { HubMessageType, HubProperty } from '../constants';
import { HubMessage, HubPropertyDownstreamMessageBody } from './index';
import { IHubDownstreamMessageValueParser } from './i-hub-downstream-message-value-parser';

@Injectable()
export class HubDownstreamPropertiesValueParserService implements IHubDownstreamMessageValueParser {
    private readonly hubPropertyLength = 1;

    private readonly operationLength = 1;

    private readonly hubPropertyValueParser: { [k in HubProperty]: (payload: Uint8Array) => HubPropertyReply } = {
        [HubProperty.batteryVoltage]: (v) => this.parseBatteryData(v),
        [HubProperty.rssi]: (v) => this.parseRssiLevel(v),
    };

    public parseMessage(message: HubMessage<HubPropertyDownstreamMessageBody>): HubReply {
        if (!this.hubPropertyValueParser[message.body.hubProperty]) {
            throw new Error(`missing parser for property type: ${message.body.hubProperty}`);
        }
        const data = message.body.payload.slice(this.hubPropertyLength + this.operationLength);
        return this.hubPropertyValueParser[message.body.hubProperty](data);
    }

    private parseBatteryData(payload: Uint8Array): HubPropertyReply {
        return {
            type: HubMessageType.hubProperties,
            propertyType: HubProperty.batteryVoltage,
            level: payload[0]
        };
    }

    private parseRssiLevel(payload: Uint8Array): HubPropertyReply {
        return {
            type: HubMessageType.hubProperties,
            propertyType: HubProperty.rssi,
            level: payload[0] << 24 >> 24 // rssi is a int8 stored as uint8, so we have to convert it, ref: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-payload
        };
    }
}
