import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig } from '../../i-app-config';
import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';

@Injectable()
export class ControllerProfileJoyconLService extends GamepadProfile {
    public readonly uid = 'joycon-l';

    public name$: Observable<string>;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected readonly invertedAxisIndices: ReadonlyArray<number> = [ 1 ];

    protected axisNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('stickXAxis'),
        1: this.getTranslation('stickYAxis'),
    };

    protected buttonNames: { readonly [k in number]: Observable<string> } = {
        0: this.getTranslation('buttonDpadDown'),
        1: this.getTranslation('buttonDpadRight'),
        2: this.getTranslation('buttonDpadLeft'),
        3: this.getTranslation('buttonDpadUp'),
        4: this.getTranslation('buttonSL'),
        5: this.getTranslation('buttonSR'),
        6: this.getTranslation('zlTrigger'),
        8: this.getTranslation('lBumper'),
        9: this.getTranslation('buttonMinus'),
        10: this.getTranslation('buttonRStick'),
        16: this.getTranslation('buttonCapture'),
    };

    // chrome only, firefox has different ids
    private readonly ids: ReadonlySet<string> = new Set([
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2006)',
    ]);

    constructor(
        translocoService: TranslocoService,
        @Inject(APP_CONFIG) appConfig: IAppConfig
    ) {
        super(translocoService, 'joycon', appConfig);
        this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'l-name'));
    }

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }
}
