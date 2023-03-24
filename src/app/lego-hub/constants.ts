import { DeepReadonly } from '../types';

type BleTree = {
    services: {
        [k in string]: {
            id: string,
            characteristics: {
                [p in string]: {
                    uuid: string
                }
            }
        }
    }
};

const _LpuTree = {
    services: {
        primary: {
            id: '00001623-1212-efde-1623-785feabcd123',
            characteristics: {
                primary: {
                    uuid: '00001624-1212-efde-1623-785feabcd123'
                }
            }
        },
        battery: {
            id: 'battery_service',
            characteristics: {}
        },
        deviceInformation: {
            id: 'device_information',
            characteristics: {}
        }
    }
};

export const LpuTree: DeepReadonly<typeof _LpuTree & BleTree> = _LpuTree;
