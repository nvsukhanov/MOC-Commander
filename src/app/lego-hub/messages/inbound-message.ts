import { AttachIoEvent, HubProperty, IOType, MessageType, PortInformationReplyType, PortModeInformationType } from '../constants';

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

export type PortModeInformationBase = {
    messageType: MessageType.portModeInformation;
    portId: number;
    mode: number;
}

export type PortModeInformationName = {
    modeInformationType: PortModeInformationType.name;
    name: string;
};

export type PortModeInformationRawRange = {
    modeInformationType: PortModeInformationType.rawRange;
    rawMin: number;
    rawMax: number;
}

export type PortModeInformationPctRange = {
    modeInformationType: PortModeInformationType.pctRange;
    pctMin: number;
    pctMax: number;
}

export type PortModeInformationSiRange = {
    modeInformationType: PortModeInformationType.siRange;
    siMin: number;
    siMax: number;
}

export type PortModeInformationSymbol = {
    modeInformationType: PortModeInformationType.symbol;
    symbol: string;
}

export type PortModeInformationMapping = {
    modeInformationType: PortModeInformationType.mapping;
    inputSide: {
        supportsNull: boolean;
        supportsFunctionalMapping: boolean;
        abs: boolean;
        rel: boolean;
        dis: boolean;
    },
    outputSide: {
        supportsNull: boolean;
        supportsFunctionalMapping: boolean;
        abs: boolean;
        rel: boolean;
        dis: boolean;
    }
};

export type PortModeInformationMotorBias = {
    modeInformationType: PortModeInformationType.motorBias;
    motorBias: number;
};

export type PortModeInformationCapabilityBits = {
    modeInformationType: PortModeInformationType.capabilityBits;
    capabilityBitsBE: [ number, number, number, number, number, number ];
}

export type PortModeInformationValueFormat = {
    modeInformationType: PortModeInformationType.valueFormat;
    valueFormat: [ number, number, number, number ];
}

export type PortModeInformationInboundMessageTypes =
    (PortModeInformationName
        | PortModeInformationRawRange
        | PortModeInformationPctRange
        | PortModeInformationSiRange
        | PortModeInformationSymbol
        | PortModeInformationMapping
        | PortModeInformationMotorBias
        | PortModeInformationCapabilityBits
        | PortModeInformationValueFormat
        ) & PortModeInformationBase;
export type PortInformationInboundMessageTypes = PortInformationModeInfoInboundMessage;

export type InboundMessage =
    HubPropertyInboundMessage
    | AttachedIOInboundMessage
    | PortInformationInboundMessageTypes
    | PortValueInboundMessage
    | PortModeInformationInboundMessageTypes
