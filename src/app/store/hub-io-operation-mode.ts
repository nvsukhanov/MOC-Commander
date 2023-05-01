import { GamepadInputMethod } from './i-state';
import { PortModeName } from '../lego-hub';

export enum HubIoOperationMode {
    Linear = 'linear',
}

export const HUB_IO_CONTROL_METHODS: { [k in GamepadInputMethod]: { [p in HubIoOperationMode]?: PortModeName } } = {
    [GamepadInputMethod.Axis]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        // [HubIoOperationMode.Servo]: PortModeName.absolutePosition,
    },
    [GamepadInputMethod.Button]: {
        [HubIoOperationMode.Linear]: PortModeName.speed,
        // [HubIoOperationMode.SetColor]: PortModeName.rgb
    },
} as const;
