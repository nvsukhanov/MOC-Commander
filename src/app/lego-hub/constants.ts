export const HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
export const HUB_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export enum HubMessageType {
    hubProperties = 0x01,
    hubAttachedIO = 0x04
}

export enum HubAttachIoEvent {
    Detached = 0x00,
    Attached = 0x01,
    AttachedVirtual = 0x02
}

export enum HubIOType {
    Motor = 0x0001, // 1
    SystemTrainMotor = 0x0002, // 2
    Button = 0x0005, // 5
    LedLight = 0x0008, // 8
    Voltage = 0x0014, // 20
    Current = 0x0015, // 21
    PiezoTone = 0x0016, // 22
    RgbLight = 0x0017, // 23
    ExternalTiltSensor = 0x0022, // 34
    MotionSensor = 0x0023, // 35
    VisionSensor = 0x0025, //
    ExternalMotorWithTacho = 0x0026, // 38
    InternalMotorWithTacho = 0x0027, // 39
    InternalTilt = 0x0028, // 40
    LargeTechnicMotor = 0x002E, // 46
    XLargeTechnicMotor = 0x002F, // 47
    MediumTechicAngularMotor = 0x004B, // 75
    LargeTechnicAngularMotor = 0x004C, // 76
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
export type PropertyAvailableForOperation<Operation extends HubPropertyOperation> =
    Operation extends HubPropertyOperation.enableUpdates | HubPropertyOperation.disableUpdates
    ? SubscribableHubProperties
    : HubProperty;

