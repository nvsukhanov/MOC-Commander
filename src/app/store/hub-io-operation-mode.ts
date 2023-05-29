import { ControllerInputType } from './i-state';
import { PortModeName } from '@nvsukhanov/rxpoweredup';

export enum HubIoOperationMode {
    Linear = 'linear',
    Servo = 'servo',
    // SetColor = 'set-color',
}

export const HUB_IO_CONTROL_METHODS: { [k in ControllerInputType]: { [p in HubIoOperationMode]?: PortModeName } } = {
    [ControllerInputType.Axis]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        [HubIoOperationMode.Servo]: PortModeName.absolutePosition,
    },
    [ControllerInputType.Button]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
    },
    [ControllerInputType.Trigger]: {}
} as const;
