import { Injectable } from '@angular/core';
import { HubPropertyReply, HubReply } from './hub-reply';
import { IReplyParser } from './i-reply-parser';
import { HubMessageType, HubProperty } from '../constants';
import { LoggingService } from '../../logging';

@Injectable()
export class HubPropertiesPayloadParserService implements IReplyParser {
    private readonly hubPropertyLength = 1;

    private readonly operationLength = 1;

    private readonly hubPropertiesParser: { [k in HubProperty]: (payload: Uint8Array) => HubPropertyReply | null } = {
        [HubProperty.batteryVoltage]: (v) => this.parseBatteryData(v),
        [HubProperty.name]: (v) => this.parseName(v),
        [HubProperty.rssi]: (v) => this.parseRssiLevel(v),
    };

    constructor(
        private readonly logger: LoggingService
    ) {
    }

    public parse(payload: Uint8Array): HubReply | null {
        const hubProperty: HubProperty = payload[0];
        if (!this.hubPropertiesParser[hubProperty]) {
            this.logger.warning('missing parser for property type', hubProperty);
            return null;
        }
        const data = payload.slice(this.hubPropertyLength + this.operationLength);
        return this.hubPropertiesParser[hubProperty](data);
    }

    private parseBatteryData(payload: Uint8Array): HubPropertyReply | null {
        return {
            type: HubMessageType.hubProperties,
            propertyType: HubProperty.batteryVoltage,
            level: payload[0]
        };
    }

    private parseRssiLevel(payload: Uint8Array): HubPropertyReply | null {
        return {
            type: HubMessageType.hubProperties,
            propertyType: HubProperty.rssi,
            level: payload[0] << 24 >> 24 // rssi is a int8 stored as uint8, so we have to convert it, ref: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-payload
        };
    }

    private parseName(payload: Uint8Array): HubPropertyReply | null {
        this.logger.debug('name payload', payload);
        return null;
    }
}
