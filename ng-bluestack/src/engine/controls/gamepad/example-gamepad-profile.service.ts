import { Injectable } from '@angular/core';
import { IGamepadProfile } from './i-gamepad-profile';
import { IControlAction } from '../i-control-action';
import { IVector } from '../../../app/types';

@Injectable()
export class ExampleGamepadProfileService implements IGamepadProfile {
    private readonly thresholds: Readonly<IVector> = { x: 0.1, y: 0.1 };

    public apply(pad: Gamepad): IControlAction {
        const vector = this.applyThreshold({
            x: pad.axes[0],
            y: pad.axes[1]
        });
        return {
            ...vector,
            fire: pad.buttons[0].pressed
        };
    }

    private applyThreshold(
        axes: Readonly<IVector>,
    ): IVector {
        return {
            x: Math.abs(axes.x) < this.thresholds.x ? 0 : axes.x,
            y: Math.abs(axes.y) < this.thresholds.y ? 0 : axes.y,
        }
    }
}
