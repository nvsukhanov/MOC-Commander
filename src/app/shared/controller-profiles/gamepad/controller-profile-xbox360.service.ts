import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig } from '../../i-app-config';
import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';

@Injectable()
export class ControllerProfileXbox360Service extends GamepadProfile {
    public readonly uid = 'xbox360';

    public readonly name$: Observable<string>;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected readonly invertedAxisIndices: ReadonlyArray<number> = [ 1, 3 ];

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

    private readonly ids: ReadonlySet<string> = new Set([
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
        'HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)'
    ]);

    constructor(
        translocoService: TranslocoService,
        @Inject(APP_CONFIG) appConfig: IAppConfig
    ) {
        super(translocoService, 'xbox360', appConfig);
        this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'name'));
    }

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }
}
