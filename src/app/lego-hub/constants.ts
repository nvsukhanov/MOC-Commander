export const HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
export const HUB_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export enum MessageType {
    properties = 0x01,
    attachedIO = 0x04,
    portInformationRequest = 0x21, // 33
    portInformation = 0x43, // 67
    portValue = 0x45, // 69
}

export enum PortInformationRequestType {
    portValue = 0x00,
    modeInformation = 0x01,
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
}

export type SubscribableHubProperties = HubProperty.rssi | HubProperty.batteryVoltage;
