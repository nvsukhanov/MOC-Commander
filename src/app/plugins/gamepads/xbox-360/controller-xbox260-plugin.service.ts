import { Injectable } from '@angular/core';
import { GamepadControllerConfig } from '../../../store';
import { ControllerXbox360ViewComponent } from './controller-xbox360-view.component';
import { GamepadPlugin } from '../gamepad-plugin';

@Injectable()
export class ControllerXbox260PluginService extends GamepadPlugin {
    public readonly configViewType = ControllerXbox360ViewComponent;

    private readonly ids: ReadonlySet<string> = new Set([
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
    ]); // chrome only, firefox has different ids

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }

    protected mapSpecificFields(): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'> {
        return {
            nameL10nKey: 'dualshockName$',
            axes: [
                { nameL10nKey: 'xbox360LeftStickXAxis$', index: 0, isButton: false },
                { nameL10nKey: 'xbox360LeftStickYAxis$', index: 1, isButton: false },
                { nameL10nKey: 'xbox360RightStickXAxis$', index: 2, isButton: false },
                { nameL10nKey: 'xbox360RightStickYAxis$', index: 3, isButton: false },
                { nameL10nKey: 'xbox360LT$', buttonIndex: 6, isButton: true },
                { nameL10nKey: 'xbox360RT$', buttonIndex: 7, isButton: true },
            ],
            buttons: [
                { index: 0, nameL10nKey: 'xbox360ButtonA$' },
                { index: 1, nameL10nKey: 'xbox360ButtonB$' },
                { index: 2, nameL10nKey: 'xbox360ButtonX$' },
                { index: 3, nameL10nKey: 'xbox360ButtonY$' },
                { index: 4, nameL10nKey: 'xbox360LB$' },
                { index: 5, nameL10nKey: 'xbox360RB$' },
                { index: 8, nameL10nKey: 'xbox360ButtonShare$' },
                { index: 9, nameL10nKey: 'xbox360ButtonMenu$' },
                { index: 10, nameL10nKey: 'xbox360ButtonLeftStick$' },
                { index: 11, nameL10nKey: 'xbox360RightStickXAxis$' },
                { index: 12, nameL10nKey: 'xbox360ButtonUp$' },
                { index: 13, nameL10nKey: 'xbox360ButtonDown$' },
                { index: 14, nameL10nKey: 'xbox360ButtonLeft$' },
                { index: 15, nameL10nKey: 'xbox360ButtonRight$' },
            ]
        };
    }
}
