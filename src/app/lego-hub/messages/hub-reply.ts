import { HubAttachIoEvent, HubIOType, HubMessageType, HubProperty } from '../constants';

export type BatteryLevelReply = {
    propertyType: HubProperty.batteryVoltage,
    level: number
}

export type RssiLevelReply = {
    propertyType: HubProperty.rssi,
    level: number
}

export type HubPropertyReply = {
    type: HubMessageType.hubProperties,
} & (BatteryLevelReply | RssiLevelReply);

export type HubAttachedIoReply = {
    type: HubMessageType.hubAttachedIO,
    portId: number;
    event: HubAttachIoEvent.Attached;
    ioTypeId: HubIOType;
}

export type HubAttachedVirtualIoReply = {
    type: HubMessageType.hubAttachedIO,
    portId: number;
    event: HubAttachIoEvent.AttachedVirtual;
    ioTypeId: HubIOType;
    portIdA: number;
    portIdB: number;
}

export type HubDetachedIoReply = {
    type: HubMessageType.hubAttachedIO,
    portId: number;
    event: HubAttachIoEvent.Detached;
}

export type HubIOEventReply = HubAttachedIoReply | HubAttachedVirtualIoReply | HubDetachedIoReply;

export type HubReply = HubPropertyReply | HubIOEventReply;
