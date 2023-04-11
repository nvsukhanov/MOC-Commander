import { Injectable } from '@angular/core';
import { GamepadButtonType, GamepadConfig } from '../../../store';
import { ControllerXbox360ViewComponent } from './controller-xbox360-view.component';
import { GamepadPlugin } from '../gamepad-plugin';
import { createGamepadL10nKey } from '../create-gamepad-l10n-key';

@Injectable()
export class ControllerXbox360PluginService extends GamepadPlugin {
    public readonly configViewType = ControllerXbox360ViewComponent;

    private readonly l10nScopeName = 'xbox360';

    private readonly ids: ReadonlySet<string> = new Set([
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
    ]); // chrome only, firefox has different ids

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }

    protected mapSpecificFields(): Pick<GamepadConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: this.createXbox360L10nKey('name'),
            axes: [
                { nameL10nKey: this.createXbox360L10nKey('leftStickXAxis'), index: 0 },
                { nameL10nKey: this.createXbox360L10nKey('leftStickYAxis'), index: 1 },
                { nameL10nKey: this.createXbox360L10nKey('rightStickXAxis'), index: 2 },
                { nameL10nKey: this.createXbox360L10nKey('rightStickYAxis'), index: 3 },
            ],
            buttons: [
                { index: 0, nameL10nKey: this.createXbox360L10nKey('buttonA'), buttonType: GamepadButtonType.Button },
                { index: 1, nameL10nKey: this.createXbox360L10nKey('buttonB'), buttonType: GamepadButtonType.Button },
                { index: 2, nameL10nKey: this.createXbox360L10nKey('buttonX'), buttonType: GamepadButtonType.Button },
                { index: 3, nameL10nKey: this.createXbox360L10nKey('buttonY'), buttonType: GamepadButtonType.Button },
                { index: 4, nameL10nKey: this.createXbox360L10nKey('lBumper'), buttonType: GamepadButtonType.Button },
                { index: 5, nameL10nKey: this.createXbox360L10nKey('rBumper'), buttonType: GamepadButtonType.Button },
                { index: 6, nameL10nKey: this.createXbox360L10nKey('lTrigger'), buttonType: GamepadButtonType.Trigger },
                { index: 7, nameL10nKey: this.createXbox360L10nKey('rTrigger'), buttonType: GamepadButtonType.Trigger },
                { index: 8, nameL10nKey: this.createXbox360L10nKey('buttonShare'), buttonType: GamepadButtonType.Button },
                { index: 9, nameL10nKey: this.createXbox360L10nKey('buttonMenu'), buttonType: GamepadButtonType.Button },
                { index: 10, nameL10nKey: this.createXbox360L10nKey('leftStickPress'), buttonType: GamepadButtonType.Button },
                { index: 11, nameL10nKey: this.createXbox360L10nKey('rightStickPress'), buttonType: GamepadButtonType.Button },
                { index: 12, nameL10nKey: this.createXbox360L10nKey('buttonDpadUp'), buttonType: GamepadButtonType.Button },
                { index: 13, nameL10nKey: this.createXbox360L10nKey('buttonDpadDown'), buttonType: GamepadButtonType.Button },
                { index: 14, nameL10nKey: this.createXbox360L10nKey('buttonDpadLeft'), buttonType: GamepadButtonType.Button },
                { index: 15, nameL10nKey: this.createXbox360L10nKey('buttonDpadRight'), buttonType: GamepadButtonType.Button },
            ]
        };
    }

    private createXbox360L10nKey(key: string): string {
        return [ createGamepadL10nKey(this.l10nScopeName), key ].join('.');
    }
}
