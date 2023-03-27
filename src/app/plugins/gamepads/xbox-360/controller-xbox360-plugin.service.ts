import { Injectable } from '@angular/core';
import { GamepadControllerConfig } from '../../../store';
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

    protected mapSpecificFields(): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: this.createXbox360L10nKey('name'),
            axes: [
                { nameL10nKey: this.createXbox360L10nKey('leftStickXAxis'), index: 0, isButton: false },
                { nameL10nKey: this.createXbox360L10nKey('leftStickYAxis'), index: 1, isButton: false },
                { nameL10nKey: this.createXbox360L10nKey('rightStickXAxis'), index: 2, isButton: false },
                { nameL10nKey: this.createXbox360L10nKey('rightStickYAxis'), index: 3, isButton: false },
                { nameL10nKey: this.createXbox360L10nKey('lTrigger'), buttonIndex: 6, isButton: true },
                { nameL10nKey: this.createXbox360L10nKey('rTrigger'), buttonIndex: 7, isButton: true },
            ],
            buttons: [
                { index: 0, nameL10nKey: this.createXbox360L10nKey('buttonA') },
                { index: 1, nameL10nKey: this.createXbox360L10nKey('buttonB') },
                { index: 2, nameL10nKey: this.createXbox360L10nKey('buttonX') },
                { index: 3, nameL10nKey: this.createXbox360L10nKey('buttonY') },
                { index: 4, nameL10nKey: this.createXbox360L10nKey('lBumper') },
                { index: 5, nameL10nKey: this.createXbox360L10nKey('rBumper') },
                { index: 8, nameL10nKey: this.createXbox360L10nKey('buttonShare') },
                { index: 9, nameL10nKey: this.createXbox360L10nKey('buttonMenu') },
                { index: 10, nameL10nKey: this.createXbox360L10nKey('leftStickPress') },
                { index: 11, nameL10nKey: this.createXbox360L10nKey('rightStickPress') },
                { index: 12, nameL10nKey: this.createXbox360L10nKey('buttonDpadUp') },
                { index: 13, nameL10nKey: this.createXbox360L10nKey('buttonDpadDown') },
                { index: 14, nameL10nKey: this.createXbox360L10nKey('buttonDpadLeft') },
                { index: 15, nameL10nKey: this.createXbox360L10nKey('buttonDpadRight') },
            ]
        };
    }

    private createXbox360L10nKey(key: string): string {
        return [ createGamepadL10nKey(this.l10nScopeName), key ].join('.');
    }
}
