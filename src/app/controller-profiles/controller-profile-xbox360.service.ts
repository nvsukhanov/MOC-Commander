import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { APP_CONFIG, ControllerType, IAppConfig } from '@app/shared';

import { GamepadProfile } from './gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from './create-controller-l10n-key';
import { GamepadSettings } from './controller-settings';

@Injectable()
export class ControllerProfileXbox360Service extends GamepadProfile {
    public readonly uid = 'xbox360';

    public readonly nameL10nKey = createScopedControllerL10nKey(this.l10nScopeName, 'name');

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected axisNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('leftStickXAxis'),
        1: this.getTranslation('leftStickYAxis'),
        2: this.getTranslation('rightStickXAxis'),
        3: this.getTranslation('rightStickYAxis')
    };

    protected buttonNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('buttonA'),
        1: this.getTranslation('buttonB'),
        2: this.getTranslation('buttonX'),
        3: this.getTranslation('buttonY'),
        4: this.getTranslation('lBumper'),
        5: this.getTranslation('rBumper'),
        6: this.getTranslation('lTrigger'),
        7: this.getTranslation('rTrigger'),
        8: this.getTranslation('buttonShare'),
        9: this.getTranslation('buttonMenu'),
        10: this.getTranslation('leftStickPress'),
        11: this.getTranslation('rightStickPress'),
        12: this.getTranslation('buttonDpadUp'),
        13: this.getTranslation('buttonDpadDown'),
        14: this.getTranslation('buttonDpadLeft'),
        15: this.getTranslation('buttonDpadRight'),
    };

    // chrome only, firefox has different ids
    private readonly ids: ReadonlySet<string> = new Set([
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
    ]);

    constructor(
        translocoService: TranslocoService,
        @Inject(APP_CONFIG) private readonly appConfig: IAppConfig
    ) {
        super(translocoService, 'xbox360');
    }

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }

    public getDefaultSettings(): GamepadSettings {
        return {
            controllerType: ControllerType.Gamepad,
            axisConfigs: {
                0: {
                    invert: false,
                    activeZoneStart: this.appConfig.gamepadAxisDefaultDeadZone,
                    activeZoneEnd: 1
                },
                1: {
                    invert: true,
                    activeZoneStart: this.appConfig.gamepadAxisDefaultDeadZone,
                    activeZoneEnd: 1
                },
                2: {
                    invert: false,
                    activeZoneStart: this.appConfig.gamepadAxisDefaultDeadZone,
                    activeZoneEnd: 1
                },
                3: {
                    invert: true,
                    activeZoneStart: this.appConfig.gamepadAxisDefaultDeadZone,
                    activeZoneEnd: 1
                }
            }
        };
    }
}
