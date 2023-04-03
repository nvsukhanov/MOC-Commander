import { AttachIoEvent, HubProperty, IOType, MessageType, PortInformationReplyType } from '../constants';

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
    messageType: MessageType.portValueSingle,
    portId: number;
    payload: Uint8Array
}

export type PortInformationModeInfoInboundMessage = {
    messageType: MessageType.portInformation,
    portId: number;
    informationType: PortInformationReplyType.modeInfo,
    capabilities: {
        output: boolean;
        input: boolean;
        logicalCombinable: boolean;
        logicalSynchronizable: boolean;
    };
    totalModeCount: number;
    inputModes: number[];
    outputModes: number[];
}

export type PortInformationInboundMessageTypes = PortInformationModeInfoInboundMessage;

export type InboundMessage =
    HubPropertyInboundMessage
    | AttachedIOInboundMessage
    | PortInformationInboundMessageTypes
    | PortValueInboundMessage;
