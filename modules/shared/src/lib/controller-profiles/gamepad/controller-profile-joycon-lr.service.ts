import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig } from '../../i-app-config';
import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';

@Injectable()
export class ControllerProfileJoyconLrService extends GamepadProfile {
    public readonly uid = 'joycon-lr';

    public name$: Observable<string>;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected readonly invertedAxisIndices: ReadonlyArray<number> = [ 1, 3 ];

    protected axisNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('leftStickXAxis'),
        1: this.getTranslation('leftStickYAxis'),
        2: this.getTranslation('rightStickXAxis'),
        3: this.getTranslation('rightStickYAxis'),
    };

    protected buttonNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('buttonB'),
        1: this.getTranslation('buttonA'),
        2: this.getTranslation('buttonY'),
        3: this.getTranslation('buttonX'),
        4: this.getTranslation('lBumper'),
        5: this.getTranslation('rBumper'),
        6: this.getTranslation('zlTrigger'),
        7: this.getTranslation('zrTrigger'),
        8: this.getTranslation('buttonMinus'),
        9: this.getTranslation('buttonPlus'),
        10: this.getTranslation('buttonLStick'),
        11: this.getTranslation('buttonRStick'),
        12: this.getTranslation('buttonDpadUp'),
        13: this.getTranslation('buttonDpadDown'),
        14: this.getTranslation('buttonDpadLeft'),
        15: this.getTranslation('buttonDpadRight'),
        16: this.getTranslation('buttonHome'),
        17: this.getTranslation('buttonCapture'),
        18: this.getTranslation('buttonSLL'),
        19: this.getTranslation('buttonSRL'),
        20: this.getTranslation('buttonSLR'),
        21: this.getTranslation('buttonSRR'),
    };

    // chrome only, firefox has different ids
    private readonly ids: ReadonlySet<string> = new Set([
        'Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)',
    ]);

    constructor(
        translocoService: TranslocoService,
        @Inject(APP_CONFIG) appConfig: IAppConfig
    ) {
        super(translocoService, 'joycon', appConfig);
        this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'combined'));
    }

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }
}
