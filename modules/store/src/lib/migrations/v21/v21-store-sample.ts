import { IOType, PortModeName, PortModeSymbol } from 'rxpoweredup';
import { Language } from '@app/shared-i18n';
import { ControllerType } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V21Store } from '../v21-v22';

export const V21_STORE_SAMPLE: DeepPartial<V21Store> = {
    'hubs': {
        'ids': [
            '00:0f:b0:fa:ce:2d',
            '00:0f:b0:fa:ce:3d',
            '00:0f:b0:fa:ce:4d'
        ],
        'entities': {
            '00:0f:b0:fa:ce:2d': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'name': 'Handset',
                'hubType': 4
            },
            '00:0f:b0:fa:ce:4d': {
                'hubId': '00:0f:b0:fa:ce:4d',
                'name': 'Choo choo',
                'hubType': 3
            },
            '00:0f:b0:fa:ce:3d': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'name': 'Technic Hub',
                'hubType': 6
            }
        }
    },
    'controllerSettings': {
        'ids': [
            'hub-00:0f:b0:fa:ce:3d',
            'gamepad-xbox360/0',
            'keyboard',
            'hub-00:0f:b0:fa:ce:4d',
            'hub-00:0f:b0:fa:ce:2d'
        ],
        'entities': {
            'hub-00:0f:b0:fa:ce:3d': {
                'controllerId': 'hub-00:0f:b0:fa:ce:3d',
                'ignoreInput': false,
                'controllerType': ControllerType.Hub
            },
            'gamepad-xbox360/0': {
                'controllerId': 'gamepad-xbox360/0',
                'ignoreInput': false,
                'controllerType': ControllerType.Gamepad,
                'axisConfigs': {
                    '0': {
                        'invert': false,
                        'activeZoneStart': 0.1,
                        'activeZoneEnd': 1
                    },
                    '1': {
                        'invert': true,
                        'activeZoneStart': 0.1,
                        'activeZoneEnd': 1
                    },
                    '2': {
                        'invert': false,
                        'activeZoneStart': 0.1,
                        'activeZoneEnd': 1
                    },
                    '3': {
                        'invert': true,
                        'activeZoneStart': 0.1,
                        'activeZoneEnd': 1
                    }
                }
            },
            'keyboard': {
                'controllerId': 'keyboard',
                'ignoreInput': false,
                'controllerType': ControllerType.Keyboard,
                'captureNonAlphaNumerics': false
            },
            'hub-00:0f:b0:fa:ce:4d': {
                'controllerId': 'hub-00:0f:b0:fa:ce:4d',
                'ignoreInput': false,
                'controllerType': ControllerType.Hub
            },
            'hub-00:0f:b0:fa:ce:2d': {
                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                'ignoreInput': false,
                'controllerType': ControllerType.Hub
            }
        }
    },
    'controllers': {
        'ids': [
            'hub-00:0f:b0:fa:ce:3d',
            'gamepad-xbox360/0',
            'keyboard',
            'hub-00:0f:b0:fa:ce:4d',
            'hub-00:0f:b0:fa:ce:2d'
        ],
        'entities': {
            'hub-00:0f:b0:fa:ce:3d': {
                'id': 'hub-00:0f:b0:fa:ce:3d',
                'controllerType': ControllerType.Hub,
                'hubId': '00:0f:b0:fa:ce:3d',
                'profileUid': 'hub-00:0f:b0:fa:ce:3d'
            },
            'gamepad-xbox360/0': {
                'id': 'gamepad-xbox360/0',
                'controllerType': ControllerType.Gamepad,
                'axesCount': 4,
                'buttonsCount': 17,
                'triggerButtonIndices': [
                    6,
                    7
                ],
                'profileUid': 'xbox360',
                'gamepadOfTypeIndex': 0
            },
            'keyboard': {
                'id': 'keyboard',
                'controllerType': ControllerType.Keyboard,
                'profileUid': 'keyboard'
            },
            'hub-00:0f:b0:fa:ce:4d': {
                'id': 'hub-00:0f:b0:fa:ce:4d',
                'controllerType': ControllerType.Hub,
                'hubId': '00:0f:b0:fa:ce:4d',
                'profileUid': 'hub-00:0f:b0:fa:ce:4d'
            },
            'hub-00:0f:b0:fa:ce:2d': {
                'id': 'hub-00:0f:b0:fa:ce:2d',
                'controllerType': ControllerType.Hub,
                'hubId': '00:0f:b0:fa:ce:2d',
                'profileUid': 'hub-00:0f:b0:fa:ce:2d'
            }
        }
    },
    'attachedIos': {
        'ids': [
            '00:0f:b0:fa:ce:3d/0',
            '00:0f:b0:fa:ce:2d/0',
            '00:0f:b0:fa:ce:3d/1',
            '00:0f:b0:fa:ce:2d/1',
            '00:0f:b0:fa:ce:3d/50',
            '00:0f:b0:fa:ce:4d/50',
            '00:0f:b0:fa:ce:2d/52',
            '00:0f:b0:fa:ce:3d/59',
            '00:0f:b0:fa:ce:4d/59',
            '00:0f:b0:fa:ce:2d/59',
            '00:0f:b0:fa:ce:3d/60',
            '00:0f:b0:fa:ce:4d/60',
            '00:0f:b0:fa:ce:2d/60',
            '00:0f:b0:fa:ce:3d/61',
            '00:0f:b0:fa:ce:3d/96',
            '00:0f:b0:fa:ce:3d/97',
            '00:0f:b0:fa:ce:3d/98',
            '00:0f:b0:fa:ce:3d/99',
            '00:0f:b0:fa:ce:3d/100'
        ],
        'entities': {
            '00:0f:b0:fa:ce:2d/0': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'portId': 0,
                'ioType': 55,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:2d/1': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'portId': 1,
                'ioType': 55,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:2d/52': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'portId': 52,
                'ioType': 23,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:2d/59': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'portId': 59,
                'ioType': 20,
                'hardwareRevision': '0.2.0.0',
                'softwareRevision': '0.2.0.0'
            },
            '00:0f:b0:fa:ce:2d/60': {
                'hubId': '00:0f:b0:fa:ce:2d',
                'portId': 60,
                'ioType': 56 as IOType,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:4d/50': {
                'hubId': '00:0f:b0:fa:ce:4d',
                'portId': 50,
                'ioType': 23,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:4d/59': {
                'hubId': '00:0f:b0:fa:ce:4d',
                'portId': 59,
                'ioType': 21,
                'hardwareRevision': '0.2.0.0',
                'softwareRevision': '0.2.0.0'
            },
            '00:0f:b0:fa:ce:4d/60': {
                'hubId': '00:0f:b0:fa:ce:4d',
                'portId': 60,
                'ioType': 20,
                'hardwareRevision': '0.2.0.0',
                'softwareRevision': '0.2.0.0'
            },
            '00:0f:b0:fa:ce:3d/0': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 0,
                'ioType': 46,
                'hardwareRevision': '0.0.16.0',
                'softwareRevision': '0.0.16.0'
            },
            '00:0f:b0:fa:ce:3d/1': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 1,
                'ioType': 46,
                'hardwareRevision': '0.0.16.0',
                'softwareRevision': '0.0.16.0'
            },
            '00:0f:b0:fa:ce:3d/50': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 50,
                'ioType': 23,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:3d/59': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 59,
                'ioType': 21,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:3d/60': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 60,
                'ioType': 20,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:3d/61': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 61,
                'ioType': 60,
                'hardwareRevision': '0.0.0.0',
                'softwareRevision': '0.0.0.0'
            },
            '00:0f:b0:fa:ce:3d/96': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 96,
                'ioType': 60,
                'hardwareRevision': '0.1.0.0',
                'softwareRevision': '0.1.0.0'
            },
            '00:0f:b0:fa:ce:3d/97': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 97,
                'ioType': 57,
                'hardwareRevision': '0.1.0.0',
                'softwareRevision': '0.1.0.0'
            },
            '00:0f:b0:fa:ce:3d/98': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 98,
                'ioType': 58,
                'hardwareRevision': '0.1.0.0',
                'softwareRevision': '0.1.0.0'
            },
            '00:0f:b0:fa:ce:3d/99': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 99,
                'ioType': 59,
                'hardwareRevision': '0.1.0.0',
                'softwareRevision': '0.1.0.0'
            },
            '00:0f:b0:fa:ce:3d/100': {
                'hubId': '00:0f:b0:fa:ce:3d',
                'portId': 100,
                'ioType': 54,
                'hardwareRevision': '0.1.0.0',
                'softwareRevision': '0.1.0.0'
            }
        }
    },
    'attachedIoModes': {
        'ids': [
            '0.0.16.0/0.0.16.0/46',
            '0.0.0.0/0.0.0.0/23',
            '0.0.0.0/0.0.0.0/21',
            '0.0.0.0/0.0.0.0/20',
            '0.0.0.0/0.0.0.0/60',
            '0.1.0.0/0.1.0.0/60',
            '0.1.0.0/0.1.0.0/57',
            '0.1.0.0/0.1.0.0/58',
            '0.1.0.0/0.1.0.0/59',
            '0.1.0.0/0.1.0.0/54',
            '0.2.0.0/0.2.0.0/21',
            '0.2.0.0/0.2.0.0/20',
            '0.0.0.0/0.0.0.0/55',
            '0.0.0.0/0.0.0.0/56'
        ],
        'entities': {
            '0.0.16.0/0.0.16.0/46': {
                'id': '0.0.16.0/0.0.16.0/46',
                'portInputModes': [
                    1,
                    2,
                    3,
                    4
                ],
                'portOutputModes': [
                    0,
                    1,
                    2,
                    3,
                    4
                ],
                'synchronizable': true
            },
            '0.0.0.0/0.0.0.0/23': {
                'id': '0.0.0.0/0.0.0.0/23',
                'portInputModes': [],
                'portOutputModes': [
                    0,
                    1
                ],
                'synchronizable': false
            },
            '0.0.0.0/0.0.0.0/21': {
                'id': '0.0.0.0/0.0.0.0/21',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.0.0.0/0.0.0.0/20': {
                'id': '0.0.0.0/0.0.0.0/20',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.0.0.0/0.0.0.0/60': {
                'id': '0.0.0.0/0.0.0.0/60',
                'portInputModes': [
                    0
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.1.0.0/0.1.0.0/60': {
                'id': '0.1.0.0/0.1.0.0/60',
                'portInputModes': [
                    0
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.1.0.0/0.1.0.0/57': {
                'id': '0.1.0.0/0.1.0.0/57',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.1.0.0/0.1.0.0/58': {
                'id': '0.1.0.0/0.1.0.0/58',
                'portInputModes': [
                    0
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.1.0.0/0.1.0.0/59': {
                'id': '0.1.0.0/0.1.0.0/59',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [
                    2
                ],
                'synchronizable': false
            },
            '0.1.0.0/0.1.0.0/54': {
                'id': '0.1.0.0/0.1.0.0/54',
                'portInputModes': [
                    0
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.2.0.0/0.2.0.0/21': {
                'id': '0.2.0.0/0.2.0.0/21',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.2.0.0/0.2.0.0/20': {
                'id': '0.2.0.0/0.2.0.0/20',
                'portInputModes': [
                    0,
                    1
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.0.0.0/0.0.0.0/55': {
                'id': '0.0.0.0/0.0.0.0/55',
                'portInputModes': [
                    0,
                    1,
                    2,
                    3,
                    4
                ],
                'portOutputModes': [],
                'synchronizable': false
            },
            '0.0.0.0/0.0.0.0/56': {
                'id': '0.0.0.0/0.0.0.0/56',
                'portInputModes': [
                    0
                ],
                'portOutputModes': [],
                'synchronizable': false
            }
        }
    },
    'attachedIoPortModeInfo': {
        'ids': [
            '0.0.16.0/0.0.16.0/46/0',
            '0.0.16.0/0.0.16.0/46/1',
            '0.0.16.0/0.0.16.0/46/2',
            '0.0.16.0/0.0.16.0/46/3',
            '0.0.16.0/0.0.16.0/46/4',
            '0.0.0.0/0.0.0.0/23/0',
            '0.0.0.0/0.0.0.0/23/1',
            '0.0.0.0/0.0.0.0/21/0',
            '0.0.0.0/0.0.0.0/21/1',
            '0.0.0.0/0.0.0.0/20/0',
            '0.0.0.0/0.0.0.0/20/1',
            '0.0.0.0/0.0.0.0/60/0',
            '0.1.0.0/0.1.0.0/60/0',
            '0.1.0.0/0.1.0.0/57/0',
            '0.1.0.0/0.1.0.0/57/1',
            '0.1.0.0/0.1.0.0/58/0',
            '0.1.0.0/0.1.0.0/59/2',
            '0.1.0.0/0.1.0.0/59/0',
            '0.1.0.0/0.1.0.0/59/1',
            '0.1.0.0/0.1.0.0/54/0',
            '0.2.0.0/0.2.0.0/21/0',
            '0.2.0.0/0.2.0.0/21/1',
            '0.2.0.0/0.2.0.0/20/0',
            '0.2.0.0/0.2.0.0/20/1',
            '0.0.0.0/0.0.0.0/55/0',
            '0.0.0.0/0.0.0.0/55/1',
            '0.0.0.0/0.0.0.0/55/2',
            '0.0.0.0/0.0.0.0/55/3',
            '0.0.0.0/0.0.0.0/55/4',
            '0.0.0.0/0.0.0.0/56/0'
        ],
        'entities': {
            '0.0.16.0/0.0.16.0/46/0': {
                'id': '0.0.16.0/0.0.16.0/46/0',
                'modeId': 0,
                'name': 'POWER' as PortModeName,
                'symbol': 'PCT' as PortModeSymbol
            },
            '0.0.16.0/0.0.16.0/46/1': {
                'id': '0.0.16.0/0.0.16.0/46/1',
                'modeId': 1,
                'name': 'SPEED' as PortModeName,
                'symbol': 'PCT' as PortModeSymbol
            },
            '0.0.16.0/0.0.16.0/46/2': {
                'id': '0.0.16.0/0.0.16.0/46/2',
                'modeId': 2,
                'name': 'POS' as PortModeName,
                'symbol': 'DEG' as PortModeSymbol
            },
            '0.0.16.0/0.0.16.0/46/3': {
                'id': '0.0.16.0/0.0.16.0/46/3',
                'modeId': 3,
                'name': 'APOS' as PortModeName,
                'symbol': 'DEG' as PortModeSymbol
            },
            '0.0.16.0/0.0.16.0/46/4': {
                'id': '0.0.16.0/0.0.16.0/46/4',
                'modeId': 4,
                'name': 'LOAD' as PortModeName,
                'symbol': 'PCT' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/23/0': {
                'id': '0.0.0.0/0.0.0.0/23/0',
                'modeId': 0,
                'name': 'COL O' as PortModeName,
                'symbol': '' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/23/1': {
                'id': '0.0.0.0/0.0.0.0/23/1',
                'modeId': 1,
                'name': 'RGB O' as PortModeName,
                'symbol': '' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/21/0': {
                'id': '0.0.0.0/0.0.0.0/21/0',
                'modeId': 0,
                'name': 'CUR L' as PortModeName,
                'symbol': 'mA' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/21/1': {
                'id': '0.0.0.0/0.0.0.0/21/1',
                'modeId': 1,
                'name': 'CUR S' as PortModeName,
                'symbol': 'mA' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/20/0': {
                'id': '0.0.0.0/0.0.0.0/20/0',
                'modeId': 0,
                'name': 'VLT L' as PortModeName,
                'symbol': 'mV' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/20/1': {
                'id': '0.0.0.0/0.0.0.0/20/1',
                'modeId': 1,
                'name': 'VLT S' as PortModeName,
                'symbol': 'mV' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/60/0': {
                'id': '0.0.0.0/0.0.0.0/60/0',
                'modeId': 0,
                'name': 'TEMP' as PortModeName,
                'symbol': 'DEG' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/60/0': {
                'id': '0.1.0.0/0.1.0.0/60/0',
                'modeId': 0,
                'name': 'TEMP' as PortModeName,
                'symbol': 'DEG' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/57/0': {
                'id': '0.1.0.0/0.1.0.0/57/0',
                'modeId': 0,
                'name': 'GRV' as PortModeName,
                'symbol': 'mG' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/57/1': {
                'id': '0.1.0.0/0.1.0.0/57/1',
                'modeId': 1,
                'name': 'CAL' as PortModeName,
                'symbol': '' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/58/0': {
                'id': '0.1.0.0/0.1.0.0/58/0',
                'modeId': 0,
                'name': 'ROT' as PortModeName,
                'symbol': 'DPS' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/59/2': {
                'id': '0.1.0.0/0.1.0.0/59/2',
                'modeId': 2,
                'name': 'CFG' as PortModeName,
                'symbol': '' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/59/0': {
                'id': '0.1.0.0/0.1.0.0/59/0',
                'modeId': 0,
                'name': 'POS' as PortModeName,
                'symbol': 'DEG' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/59/1': {
                'id': '0.1.0.0/0.1.0.0/59/1',
                'modeId': 1,
                'name': 'IMP' as PortModeName,
                'symbol': 'CNT' as PortModeSymbol
            },
            '0.1.0.0/0.1.0.0/54/0': {
                'id': '0.1.0.0/0.1.0.0/54/0',
                'modeId': 0,
                'name': 'GEST' as PortModeName,
                'symbol': '' as PortModeSymbol
            },
            '0.2.0.0/0.2.0.0/21/0': {
                'id': '0.2.0.0/0.2.0.0/21/0',
                'modeId': 0,
                'name': 'CUR L' as PortModeName,
                'symbol': 'mA' as PortModeSymbol
            },
            '0.2.0.0/0.2.0.0/21/1': {
                'id': '0.2.0.0/0.2.0.0/21/1',
                'modeId': 1,
                'name': 'CUR S' as PortModeName,
                'symbol': 'mA' as PortModeSymbol
            },
            '0.2.0.0/0.2.0.0/20/0': {
                'id': '0.2.0.0/0.2.0.0/20/0',
                'modeId': 0,
                'name': 'VLT L' as PortModeName,
                'symbol': 'mV' as PortModeSymbol
            },
            '0.2.0.0/0.2.0.0/20/1': {
                'id': '0.2.0.0/0.2.0.0/20/1',
                'modeId': 1,
                'name': 'VLT S' as PortModeName,
                'symbol': 'mV' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/55/0': {
                'id': '0.0.0.0/0.0.0.0/55/0',
                'modeId': 0,
                'name': 'RCKEY' as PortModeName,
                'symbol': 'btn' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/55/1': {
                'id': '0.0.0.0/0.0.0.0/55/1',
                'modeId': 1,
                'name': 'KEYA ' as PortModeName,
                'symbol': 'btn' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/55/2': {
                'id': '0.0.0.0/0.0.0.0/55/2',
                'modeId': 2,
                'name': 'KEYR ' as PortModeName,
                'symbol': 'btn' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/55/3': {
                'id': '0.0.0.0/0.0.0.0/55/3',
                'modeId': 3,
                'name': 'KEYD ' as PortModeName,
                'symbol': 'btn' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/55/4': {
                'id': '0.0.0.0/0.0.0.0/55/4',
                'modeId': 4,
                'name': 'KEYSD' as PortModeName,
                'symbol': 'btn' as PortModeSymbol
            },
            '0.0.0.0/0.0.0.0/56/0': {
                'id': '0.0.0.0/0.0.0.0/56/0',
                'modeId': 0,
                'name': 'RSSI ' as PortModeName,
                'symbol': 'dbm' as PortModeSymbol
            }
        }
    },
    'settings': {
        'language': Language.Russian,
        'theme': 1
    },
    'storeVersion': AppStoreVersion.first,
    'controlSchemes': {
        'ids': [
            'Speed control test',
            'Servo',
            'Set angle',
            'Stepper',
            'Speed shift',
            'angle shift',
            'angle shift (1)',
            'Simple speed'
        ],
        'entities': {
            'Speed control test': {
                'name': 'Speed control test',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    },
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 0,
                        'inputs': {
                            '0': {
                                'controllerId': 'keyboard',
                                'inputId': 'w',
                                'inputType': 0,
                                'gain': 0
                            },
                            '1': {
                                'controllerId': 'keyboard',
                                'inputId': 's',
                                'inputType': 0,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'maxSpeed': 100,
                        'invert': false,
                        'power': 100,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    },
                    {
                        'id': 2,
                        'bindingType': 0,
                        'inputs': {
                            '0': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '1',
                                'inputType': 1,
                                'gain': 0
                            },
                            '1': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '0',
                                'inputType': 0,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'maxSpeed': 100,
                        'invert': false,
                        'power': 100,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    },
                    {
                        'id': 3,
                        'bindingType': 0,
                        'inputs': {
                            '0': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:4d',
                                'inputId': 'green-button',
                                'inputType': 0,
                                'gain': 0
                            },
                            '1': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '255',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 255
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'maxSpeed': 100,
                        'invert': false,
                        'power': 100,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    }
                ]
            },
            'Servo': {
                'name': 'Servo',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 2,
                        'inputs': {
                            '2': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '0',
                                'inputType': 1,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'range': 264,
                        'aposCenter': 6,
                        'speed': 30,
                        'power': 100,
                        'invert': false,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    },
                    {
                        'id': 2,
                        'bindingType': 2,
                        'inputs': {
                            '2': {
                                'controllerId': 'keyboard',
                                'inputId': 'a',
                                'inputType': 0,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'range': 263,
                        'aposCenter': -173,
                        'speed': 100,
                        'power': 100,
                        'invert': false,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    }
                ]
            },
            'Set angle': {
                'name': 'Set angle',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 1,
                        'inputs': {
                            '3': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '0',
                                'inputType': 1,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'angle': -90,
                        'speed': 100,
                        'power': 100,
                        'endState': 126,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    },
                    {
                        'id': 2,
                        'bindingType': 1,
                        'inputs': {
                            '3': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '2',
                                'inputType': 1,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'angle': 90,
                        'speed': 100,
                        'power': 100,
                        'endState': 126,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    }
                ]
            },
            'Stepper': {
                'name': 'Stepper',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 3,
                        'inputs': {
                            '4': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '255',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 255
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'degree': -360,
                        'power': 100,
                        'speed': 100,
                        'endState': 126,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    }
                ]
            },
            'Speed shift': {
                'name': 'Speed shift',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'accelerationTimeMs': 5000,
                        'decelerationTimeMs': 5000
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 4,
                        'inputs': {
                            '5': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '1',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 1
                            },
                            '6': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '255',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 255
                            },
                            '7': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '127',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 127
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'levels': [
                            100,
                            50,
                            0,
                            -50,
                            -100
                        ],
                        'power': 100,
                        'loopingMode': 0,
                        'useAccelerationProfile': true,
                        'useDecelerationProfile': true,
                        'initialLevelIndex': 2
                    }
                ]
            },
            'angle shift': {
                'name': 'angle shift',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 5,
                        'inputs': {
                            '5': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '1',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 1
                            },
                            '6': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '255',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 255
                            },
                            '7': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '127',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 127
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'angles': [
                            128,
                            49,
                            0,
                            -33,
                            -122
                        ],
                        'speed': 100,
                        'power': 100,
                        'loopingMode': 0,
                        'endState': 126,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false,
                        'initialLevelIndex': 2
                    }
                ]
            },
            'angle shift (1)': {
                'name': 'angle shift (1)',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 5,
                        'inputs': {
                            '5': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '1',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 1
                            },
                            '6': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '255',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 255
                            },
                            '7': {
                                'controllerId': 'hub-00:0f:b0:fa:ce:2d',
                                'inputId': '127',
                                'inputType': 3,
                                'gain': 0,
                                'portId': 0,
                                'buttonId': 127
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 1,
                        'angles': [
                            128,
                            49,
                            0,
                            -33,
                            -122
                        ],
                        'speed': 100,
                        'power': 100,
                        'loopingMode': 0,
                        'endState': 126,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false,
                        'initialLevelIndex': 2
                    }
                ]
            },
            'Simple speed': {
                'name': 'Simple speed',
                'portConfigs': [
                    {
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'accelerationTimeMs': 100,
                        'decelerationTimeMs': 100
                    }
                ],
                'bindings': [
                    {
                        'id': 1,
                        'bindingType': 0,
                        'inputs': {
                            '0': {
                                'controllerId': 'gamepad-xbox360/0',
                                'inputId': '7',
                                'inputType': 2,
                                'gain': 0
                            }
                        },
                        'hubId': '00:0f:b0:fa:ce:3d',
                        'portId': 0,
                        'maxSpeed': 100,
                        'invert': false,
                        'power': 100,
                        'useAccelerationProfile': false,
                        'useDecelerationProfile': false
                    }
                ]
            }
        }
    }
};
