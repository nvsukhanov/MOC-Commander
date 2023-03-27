import { Injectable } from '@angular/core';
import { GamepadControllerConfig } from '../../../store';
import { ControllerDualshockViewComponent } from './controller-dualshock-view.component';
import { GamepadPlugin } from '../gamepad-plugin';
import { createGamepadL10nKey } from '../create-gamepad-l10n-key';

@Injectable()
export class ControllerDualshockPluginService extends GamepadPlugin {
    public readonly configViewType = ControllerDualshockViewComponent;

    private readonly l10nScopeName = 'dualshock';

    private readonly ids: ReadonlySet<string> = new Set([
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)',
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 054c)',
    ]); // chrome only, firefox has different ids

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }

    protected mapSpecificFields(): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: this.createDualshockL10nKey('name'),
            axes: [
                { nameL10nKey: this.createDualshockL10nKey('leftStickXAxis'), index: 0, isButton: false },
                { nameL10nKey: this.createDualshockL10nKey('leftStickYAxis'), index: 1, isButton: false },
                { nameL10nKey: this.createDualshockL10nKey('rightStickXAxis'), index: 2, isButton: false },
                { nameL10nKey: this.createDualshockL10nKey('rightStickYAxis'), index: 3, isButton: false },
                { nameL10nKey: this.createDualshockL10nKey('l2Trigger'), buttonIndex: 6, isButton: true },
                { nameL10nKey: this.createDualshockL10nKey('r2Trigger'), buttonIndex: 7, isButton: true },
            ],
            buttons: [
                { index: 0, nameL10nKey: this.createDualshockL10nKey('buttonCross') },
                { index: 1, nameL10nKey: this.createDualshockL10nKey('buttonCircle') },
                { index: 2, nameL10nKey: this.createDualshockL10nKey('buttonSquare') },
                { index: 3, nameL10nKey: this.createDualshockL10nKey('buttonTriangle') },
                { index: 4, nameL10nKey: this.createDualshockL10nKey('l1Trigger') },
                { index: 5, nameL10nKey: this.createDualshockL10nKey('r1Trigger') },
                { index: 8, nameL10nKey: this.createDualshockL10nKey('buttonShare') },
                { index: 9, nameL10nKey: this.createDualshockL10nKey('buttonOptions') },
                { index: 10, nameL10nKey: this.createDualshockL10nKey('leftStickPress') },
                { index: 11, nameL10nKey: this.createDualshockL10nKey('rightStickPress') },
                { index: 12, nameL10nKey: this.createDualshockL10nKey('buttonDpadUp') },
                { index: 13, nameL10nKey: this.createDualshockL10nKey('buttonDpadDown') },
                { index: 14, nameL10nKey: this.createDualshockL10nKey('buttonDpadLeft') },
                { index: 15, nameL10nKey: this.createDualshockL10nKey('buttonDpadRight') },
                { index: 16, nameL10nKey: this.createDualshockL10nKey('buttonPs') },
                { index: 17, nameL10nKey: this.createDualshockL10nKey('buttonTouchpadPress') },
            ]
        };
    }

    private createDualshockL10nKey(key: string): string {
        return [ createGamepadL10nKey(this.l10nScopeName), key ].join('.');
    }
}
