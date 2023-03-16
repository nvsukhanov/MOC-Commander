import { Injectable } from '@angular/core';
import { GamepadControllerConfig } from '../../../store';
import { ControllerDualshockViewComponent } from './controller-dualshock-view.component';
import { GamepadPlugin } from '../gamepad-plugin';

@Injectable()
export class ControllerDualshockPluginService extends GamepadPlugin {
    public readonly configViewType = ControllerDualshockViewComponent;

    private readonly ids: ReadonlySet<string> = new Set([
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)',
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 054c)',
    ]); // chrome only, firefox has different ids

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }

    protected mapSpecificFields(gamepad: Gamepad): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: 'dualshockName$',
            axes: [
                { nameL10nKey: 'dualshockLeftStickXAxis$', index: 0, isButton: false },
                { nameL10nKey: 'dualshockLeftStickYAxis$', index: 1, isButton: false },
                { nameL10nKey: 'dualshockRightStickXAxis$', index: 2, isButton: false },
                { nameL10nKey: 'dualshockRightStickYAxis$', index: 3, isButton: false },
                { nameL10nKey: 'dualshockL2$', buttonIndex: 6, isButton: true },
                { nameL10nKey: 'dualshockR2$', buttonIndex: 7, isButton: true },
            ],
            buttons: [
                { index: 0, nameL10nKey: 'dualshockButtonCross$' },
                { index: 1, nameL10nKey: 'dualshockButtonCircle$' },
                { index: 2, nameL10nKey: 'dualshockButtonSquare$' },
                { index: 3, nameL10nKey: 'dualshockButtonTriangle$' },
                { index: 4, nameL10nKey: 'dualshockL1$' },
                { index: 5, nameL10nKey: 'dualshockR1$' },
                // { index: 6, nameL10nKey: 'dualshockL2$' },
                // { index: 7, nameL10nKey: 'dualshockR2$' },
                { index: 8, nameL10nKey: 'dualshockButtonShare$' },
                { index: 9, nameL10nKey: 'dualshockButtonOptions$' },
                { index: 10, nameL10nKey: 'dualshockButtonLeftStick$' },
                { index: 11, nameL10nKey: 'dualshockButtonRightStick$' },
                { index: 12, nameL10nKey: 'dualshockButtonUp$' },
                { index: 13, nameL10nKey: 'dualshockButtonDown$' },
                { index: 14, nameL10nKey: 'dualshockButtonLeft$' },
                { index: 15, nameL10nKey: 'dualshockButtonRight$' },
                { index: 16, nameL10nKey: 'dualshockButtonPS$' },
                { index: 17, nameL10nKey: 'dualshockButtonTouchpad$' },
            ]
        };
    }
}
