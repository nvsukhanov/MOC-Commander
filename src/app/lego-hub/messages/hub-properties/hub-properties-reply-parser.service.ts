import { Injectable } from '@angular/core';
import { HubProperty, MessageType } from '../../constants';
import { IReplyParser } from '../i-reply-parser';
import { RawMessage } from '../raw-message';
import { HubPropertyInboundMessage, InboundMessage } from '../inbound-message';

@Injectable()
export class HubPropertiesReplyParserService implements IReplyParser<MessageType.properties> {
    public readonly messageType = MessageType.properties;

    private readonly hubPropertyLength = 1;

    private readonly operationLength = 1;

    private readonly hubPropertyValueParser: { [k in HubProperty]: (payload: Uint8Array) => HubPropertyInboundMessage } = {
        [HubProperty.batteryVoltage]: (v) => this.parseBatteryData(v),
        [HubProperty.rssi]: (v) => this.parseRssiLevel(v),
    };

    public parseMessage(
        message: RawMessage<MessageType.properties>
    ): InboundMessage & { messageType: MessageType.properties } {
        const propertyType = message.payload[0] as HubProperty;
        const payload = message.payload.slice(this.hubPropertyLength + this.operationLength);
        return this.hubPropertyValueParser[propertyType](payload);
    }

    private parseBatteryData(payload: Uint8Array): HubPropertyInboundMessage {
        return {
            messageType: MessageType.properties,
            propertyType: HubProperty.batteryVoltage,
            level: payload[0]
        };
    }

    private parseRssiLevel(payload: Uint8Array): HubPropertyInboundMessage {
        return {
            messageType: MessageType.properties,
            propertyType: HubProperty.rssi,
            level: payload[0] << 24 >> 24 // rssi is a int8 stored as uint8, so we have to convert it, ref: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-payload
        };
    }
}
