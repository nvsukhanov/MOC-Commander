import { Injectable } from '@angular/core';
import { GamepadButtonType, GamepadConfig } from '../../../store';
import { ControllerDefaultViewComponent } from './controller-default-view.component';
import { GamepadPlugin } from '../gamepad-plugin';
import { createGamepadL10nKey } from '../create-gamepad-l10n-key';

@Injectable({ providedIn: 'root' })
export class ControllerDefaultPluginService extends GamepadPlugin {
    public readonly configViewType = ControllerDefaultViewComponent;

    public controllerIdMatch(): boolean {
        return true;
    }

    protected mapSpecificFields(gamepad: Gamepad): Pick<GamepadConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: createGamepadL10nKey('unknownGamepad'),
            axes: gamepad.axes.map((v, index) => ({
                index,
                isButton: false,
                nameL10nKey: 'genericGamepadAxisName'
            })),
            buttons: gamepad.buttons.map((v, index) => ({
                index,
                buttonType: GamepadButtonType.Button,
                nameL10nKey: 'genericGamepadButtonName'
            }))
        };
    }
}
