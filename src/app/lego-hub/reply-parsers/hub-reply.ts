import { HubMessageType, HubProperty } from '../constants';

export type BatteryLevelReply = {
    propertyType: HubProperty.batteryVoltage,
    level: number
}

export type RssiLevelReply = {
    propertyType: HubProperty.rssi,
    level: number
}

export type NameReply = {
    propertyType: HubProperty.name,
    name: string
}

export type HubPropertyReply = {
    type: HubMessageType.hubProperties,
} & (BatteryLevelReply | RssiLevelReply | NameReply);

export type HubReply = HubPropertyReply;
