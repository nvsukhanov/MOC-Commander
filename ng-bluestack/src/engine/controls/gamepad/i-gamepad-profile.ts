import { IControlAction } from '../i-control-action';

export interface IGamepadProfile {
    apply(pad: Gamepad): IControlAction;
}
