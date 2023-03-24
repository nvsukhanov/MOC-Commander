import { Injectable } from '@angular/core';
import { GamepadControllerConfig } from '../../../store';
import { ControllerDefaultViewComponent } from './controller-default-view.component';
import { GamepadPlugin } from '../gamepad-plugin';

@Injectable({ providedIn: 'root' })
export class ControllerDefaultPluginService extends GamepadPlugin {
    public readonly configViewType = ControllerDefaultViewComponent;

    public controllerIdMatch(): boolean {
        return true;
    }

    protected mapSpecificFields(gamepad: Gamepad): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            axes: gamepad.axes.map((v, index) => ({ index, isButton: false })),
            buttons: gamepad.buttons.map((v, index) => ({ index }))
        };
    }

}
