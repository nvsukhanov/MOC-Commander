export const HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
export const HUB_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export enum HubMessageType {
    hubProperties = 0x01
}

export enum HubPropertyAction {
    setProperty = 0x01,
    enableUpdates = 0x02,
    disableUpdates = 0x03,
    reset = 0x04,
    requestUpdate = 0x05,
    update = 0x06
}

export enum HubProperty {
    name = 0x01,
    rssi = 0x05,
    batteryVoltage = 0x06
}

export type SubscribableHubProperties = HubProperty.name | HubProperty.rssi | HubProperty.batteryVoltage;
