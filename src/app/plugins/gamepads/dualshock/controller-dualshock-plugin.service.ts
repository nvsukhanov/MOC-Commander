import { Injectable } from '@angular/core';
import { GamepadButtonType, GamepadConfig } from '../../../store';
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

    protected mapSpecificFields(): Pick<GamepadConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: this.createDualshockL10nKey('name'),
            axes: [
                { nameL10nKey: this.createDualshockL10nKey('leftStickXAxis'), index: 0 },
                { nameL10nKey: this.createDualshockL10nKey('leftStickYAxis'), index: 1 },
                { nameL10nKey: this.createDualshockL10nKey('rightStickXAxis'), index: 2 },
                { nameL10nKey: this.createDualshockL10nKey('rightStickYAxis'), index: 3 },
            ],
            buttons: [
                { index: 0, nameL10nKey: this.createDualshockL10nKey('buttonCross'), buttonType: GamepadButtonType.Button },
                { index: 1, nameL10nKey: this.createDualshockL10nKey('buttonCircle'), buttonType: GamepadButtonType.Button },
                { index: 2, nameL10nKey: this.createDualshockL10nKey('buttonSquare'), buttonType: GamepadButtonType.Button },
                { index: 3, nameL10nKey: this.createDualshockL10nKey('buttonTriangle'), buttonType: GamepadButtonType.Button },
                { index: 4, nameL10nKey: this.createDualshockL10nKey('l1Trigger'), buttonType: GamepadButtonType.Button },
                { index: 5, nameL10nKey: this.createDualshockL10nKey('r1Trigger'), buttonType: GamepadButtonType.Button },
                { index: 6, nameL10nKey: this.createDualshockL10nKey('l2Trigger'), buttonType: GamepadButtonType.Trigger },
                { index: 7, nameL10nKey: this.createDualshockL10nKey('r2Trigger'), buttonType: GamepadButtonType.Trigger },
                { index: 8, nameL10nKey: this.createDualshockL10nKey('buttonShare'), buttonType: GamepadButtonType.Button },
                { index: 9, nameL10nKey: this.createDualshockL10nKey('buttonOptions'), buttonType: GamepadButtonType.Button },
                { index: 10, nameL10nKey: this.createDualshockL10nKey('leftStickPress'), buttonType: GamepadButtonType.Button },
                { index: 11, nameL10nKey: this.createDualshockL10nKey('rightStickPress'), buttonType: GamepadButtonType.Button },
                { index: 12, nameL10nKey: this.createDualshockL10nKey('buttonDpadUp'), buttonType: GamepadButtonType.Button },
                { index: 13, nameL10nKey: this.createDualshockL10nKey('buttonDpadDown'), buttonType: GamepadButtonType.Button },
                { index: 14, nameL10nKey: this.createDualshockL10nKey('buttonDpadLeft'), buttonType: GamepadButtonType.Button },
                { index: 15, nameL10nKey: this.createDualshockL10nKey('buttonDpadRight'), buttonType: GamepadButtonType.Button },
                { index: 16, nameL10nKey: this.createDualshockL10nKey('buttonPs'), buttonType: GamepadButtonType.Button },
                { index: 17, nameL10nKey: this.createDualshockL10nKey('buttonTouchpadPress'), buttonType: GamepadButtonType.Button },
            ]
        };
    }

    private createDualshockL10nKey(key: string): string {
        return [ createGamepadL10nKey(this.l10nScopeName), key ].join('.');
    }
}
