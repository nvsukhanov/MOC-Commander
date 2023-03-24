import { HubMessageTypes, HubProperties } from '../constants';

export type BatteryLevelReply = {
    propertyType: HubProperties.batteryVoltage,
    level: number
}

export type HubPropertyReply = {
    type: HubMessageTypes.hubProperties,
} & BatteryLevelReply;

export type HubReply = HubPropertyReply;
