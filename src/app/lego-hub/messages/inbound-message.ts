import { AttachIoEvent, HubProperty, IOType, MessageType } from '../constants';

export type HubPropertyInboundMessage = {
    messageType: MessageType.properties,
    propertyType: HubProperty;
    level: number;
};

export type AttachedIoAttachInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.Attached;
    ioTypeId: IOType;
}

export type AttachedIOAttachVirtualInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.AttachedVirtual;
    ioTypeId: IOType;
    portIdA: number;
    portIdB: number;
}

export type AttachedIODetachInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.Detached;
}

export type AttachedIOInboundMessage = AttachedIoAttachInboundMessage | AttachedIOAttachVirtualInboundMessage | AttachedIODetachInboundMessage;

export type PortValueInboundMessage = {
    messageType: MessageType.portValue,
    portId: number;
    payload: Uint8Array
}

export type PortModeInboundMessage = {
    messageType: MessageType.portInformation,
    portId: number;
    payload: Uint8Array
}

export type InboundMessage =
    HubPropertyInboundMessage
    | AttachedIOInboundMessage
    | PortModeInboundMessage
    | PortValueInboundMessage;
