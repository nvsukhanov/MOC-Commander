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

const _Lpf2Tree = {
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

export const Lpf2Tree: DeepReadonly<typeof _Lpf2Tree & BleTree> = _Lpf2Tree;
