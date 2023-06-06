import { PortModeName } from '@nvsukhanov/rxpoweredup';

import { ControllerInputType } from './controller-input-type';

export enum HubIoOperationMode {
    Linear = 'linear',
    Servo = 'servo',
    SetAngle = 'setAngle',
}

export const HUB_IO_CONTROL_METHODS: { [k in ControllerInputType]: { [p in HubIoOperationMode]?: PortModeName } } = {
    [ControllerInputType.Axis]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        [HubIoOperationMode.Servo]: PortModeName.absolutePosition,
    },
    [ControllerInputType.Button]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        [HubIoOperationMode.Servo]: PortModeName.absolutePosition,
        [HubIoOperationMode.SetAngle]: PortModeName.absolutePosition,
    },
    [ControllerInputType.Trigger]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
    }
} as const;
