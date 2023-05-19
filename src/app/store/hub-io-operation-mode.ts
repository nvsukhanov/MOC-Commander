import { GamepadInputMethod } from './i-state';
import { PortModeName } from '@nvsukhanov/rxpoweredup';

export enum HubIoOperationMode {
    Linear = 'linear',
    Servo = 'servo',
    // SetColor = 'set-color',
}

export const HUB_IO_CONTROL_METHODS: { [k in GamepadInputMethod]: { [p in HubIoOperationMode]?: PortModeName } } = {
    [GamepadInputMethod.Axis]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        [HubIoOperationMode.Servo]: PortModeName.absolutePosition,
    },
    [GamepadInputMethod.Button]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        // [HubIoOperationMode.SetColor]: PortModeName.rgb
    },
} as const;
