export const HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
export const HUB_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export enum MessageType {
    properties = 0x01,
    attachedIO = 0x04,
    portInformationRequest = 0x21, // 33
    portModeInformationRequest = 0x22, // 34
    portInputFormatSetupSingle = 0x41, // 65
    portInformation = 0x43, // 67
    portModeInformation = 0x44, // 68
    portValueSingle = 0x45, // 69
    portOutputCommand = 0x81, // 129
}

export enum PortModeInformationType {
    name = 0x00,
    rawRange = 0x01,
    pctRange = 0x02,
    siRange = 0x03,
    symbol = 0x04,
    mapping = 0x05,
    motorBias = 0x07,
    capabilityBits = 0x08,
    valueFormat = 0x09,
}

export enum PortInformationRequestType {
    portValue = 0x00,
    modeInfo = 0x01,
}

export enum PortInformationReplyType {
    modeInfo = 0x01,
}

export enum AttachIoEvent {
    Detached = 0x00,
    Attached = 0x01,
    AttachedVirtual = 0x02
}

export enum IOType {
    motor = 0x0001, // 1
    systemTrainMotor = 0x0002, // 2
    button = 0x0005, // 5
    ledLight = 0x0008, // 8
    voltage = 0x0014, // 20
    current = 0x0015, // 21
    piezoTone = 0x0016, // 22
    rgbLight = 0x0017, // 23
    externalTiltSensor = 0x0022, // 34
    motionSensor = 0x0023, // 35
    visionSensor = 0x0025, //
    externalMotorWithTacho = 0x0026, // 38
    internalMotorWithTacho = 0x0027, // 39
    internalTilt = 0x0028, // 40
    largeTechnicMotor = 0x002E, // 46
    xLargeTechnicMotor = 0x002F, // 47
    mediumTechnicAngularMotor = 0x004B, // 75
    largeTechnicAngularMotor = 0x004C, // 76
}

export enum HubPropertyOperation {
    setProperty = 0x01,
    enableUpdates = 0x02,
    disableUpdates = 0x03,
    reset = 0x04,
    requestUpdate = 0x05,
    update = 0x06
}

export enum HubProperty {
    rssi = 0x05,
    batteryVoltage = 0x06,
    systemTypeId = 0x0B, // 11
}

export enum HubType {
    WeDoHub,
    DuploTrain,
    BoostHub,
    TwoPortHub,
    TwoPortHandset,
    Unknown
}

export const HUB_DEVICE_TYPE_MAP = {
    [0b00000000]: HubType.WeDoHub,
    [0b00100000]: HubType.DuploTrain,
    [0b01000000]: HubType.BoostHub,
    [0b01000001]: HubType.TwoPortHub,
    [0b01000010]: HubType.TwoPortHandset,
} satisfies { [k in number]: HubType };

export enum PortModeName {
    speed = 'SPEED',
    position = 'POS',
    absolutePosition = 'APOS',
    power = 'POWER',
    color = 'COL O',
    rgb = 'RGB O',
    currentS = 'CUR S',
    currentL = 'CUR L',
    voltageS = 'VLT S',
    voltageL = 'VLT L',
}

export enum PortModeSymbol {
    percent = 'PCT',
    degree = 'DEG',
    milliAmps = 'mA',
    milliVolts = 'mV',
    generic = ''
}

export enum PortOperationStartupInformation {
    bufferIfNecessary = 0b00000000,
    executeImmediately = 0b00010000
}

export enum PortOperationCompletionInformation {
    noAction = 0b00000000,
    commandFeedback = 0b00000001,
}

export enum MotorProfile {
    dontUseProfiles = 0b00000000,
    useAccelerationProfile = 0b00000001,
    useDecelerationProfile = 0b00000010,
    useAccelerationAndDecelerationProfiles = 0b00000011,
}

export enum MotorSubCommand {
    startSpeed = 0x07,
}

export type SubscribableHubProperties = HubProperty.rssi | HubProperty.batteryVoltage;
