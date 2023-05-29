import { Injectable } from '@angular/core';
import { ControllerPlugin } from '../controller-plugin';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';

@Injectable()
export class ControllerDualshockPluginService extends ControllerPlugin {

    public readonly nameL10nKey = createScopedControllerL10nKey(this.l10nScopeName, 'name');

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonIndices: ReadonlyArray<number> = [ 6, 7 ];

    protected axisNames: { readonly [k in string]: Observable<string> } = {
        0: this.getTranslation('leftStickXAxis'),
        1: this.getTranslation('leftStickYAxis'),
        2: this.getTranslation('rightStickXAxis'),
        3: this.getTranslation('rightStickYAxis')
    };

    protected buttonNames: { readonly [k in string]: Observable<string> } = {
        0: this.getTranslation('buttonCross'),
        1: this.getTranslation('buttonCircle'),
        2: this.getTranslation('buttonSquare'),
        3: this.getTranslation('buttonTriangle'),
        4: this.getTranslation('l1Trigger'),
        5: this.getTranslation('r1Trigger'),
        6: this.getTranslation('l2Trigger'),
        7: this.getTranslation('r2Trigger'),
        8: this.getTranslation('buttonShare'),
        9: this.getTranslation('buttonOptions'),
        10: this.getTranslation('leftStickPress'),
        11: this.getTranslation('rightStickPress'),
        12: this.getTranslation('buttonDpadUp'),
        13: this.getTranslation('buttonDpadDown'),
        14: this.getTranslation('buttonDpadLeft'),
        15: this.getTranslation('buttonDpadRight'),
        16: this.getTranslation('buttonPs'),
        17: this.getTranslation('buttonTouchpadPress'),
    };

    // chrome only, firefox has different ids
    private readonly ids: ReadonlySet<string> = new Set([
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)',
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 054c)',
    ]);

    constructor(
        translocoService: TranslocoService
    ) {
        super(translocoService, 'dualshock');
    }

    public controllerIdMatch(id: string): boolean {
        return this.ids.has(id);
    }
}
