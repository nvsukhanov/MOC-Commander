const _LEGO_SERVICES_UUIDS = {
    LPF2PrimaryService: '00001623-1212-efde-1623-785feabcd123',
    batteryService: 'battery_service',
    deviceInformation: 'device_information'
};

export const LEGO_SERVICES_UUIDS: Readonly<typeof _LEGO_SERVICES_UUIDS> = _LEGO_SERVICES_UUIDS;

export const LPF2_DISCOVERY_OPTIONS: RequestDeviceOptions = {
    filters: [ {
        services: [ LEGO_SERVICES_UUIDS.LPF2PrimaryService ]
    } ],
    optionalServices: [ LEGO_SERVICES_UUIDS.batteryService, LEGO_SERVICES_UUIDS.deviceInformation ]
};
