import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig } from '../../i-app-config';
import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';
import { GamepadSettings } from '../controller-settings';
import { ControllerType } from '../controller-type';

@Injectable()
export class ControllerProfileJoyconRService extends GamepadProfile {
    public readonly uid = 'joycon-r';

    public name$: Observable<string>;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected axisNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('stickXAxis'),
        1: this.getTranslation('stickYAxis'),
    };

    protected buttonNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('buttonA'),
        1: this.getTranslation('buttonX'),
        2: this.getTranslation('buttonB'),
        3: this.getTranslation('buttonY'),
        4: this.getTranslation('buttonSL'),
        5: this.getTranslation('buttonSR'),
        6: this.getTranslation('unknownButton'),
        7: this.getTranslation('zrTrigger'),
        8: this.getTranslation('zlTrigger'),
        9: this.getTranslation('buttonPlus'),
        10: this.getTranslation('buttonRStick'),
        11: this.getTranslation('unknownButton'),
        12: this.getTranslation('unknownButton'),
        13: this.getTranslation('unknownButton'),
        14: this.getTranslation('unknownButton'),
        15: this.getTranslation('unknownButton'),
        16: this.getTranslation('buttonHome'),
    };

    // chrome only, firefox has different ids
    private readonly ids: ReadonlySet<string> = new Set([
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2007)',
    ]);

    constructor(
        translocoService: TranslocoService,
        @Inject(APP_CONFIG) private readonly appConfig: IAppConfig
    ) {
        super(translocoService, 'joycon');
        this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'r-name'));
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
                }
            }
        };
    }
}
