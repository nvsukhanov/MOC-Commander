import { GamepadInputMethod } from './i-state';
import { PortModeName } from '../lego-hub';

export const HUB_IO_CONTROL_METHODS: { [k in GamepadInputMethod]: ReadonlyArray<PortModeName> } = {
    [GamepadInputMethod.Axis]: [
        PortModeName.speed,
        PortModeName.absolutePosition
    ],
    [GamepadInputMethod.Button]: [
        PortModeName.speed,
        PortModeName.absolutePosition,
        PortModeName.position,
        PortModeName.rgb
    ],
} as const;
