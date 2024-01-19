import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { getGamepadVendorAndProduct } from '../get-gamepad-vendor-and-product';
import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';
import { CONTROLLERS_CONFIG, IControllersConfig } from '../i-controllers-config';

@Injectable()
export class ControllerProfileSteamDeckService extends GamepadProfile {
    public readonly uid = 'steamDeck';

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

    private readonly vendorId = 0x28de;

    private readonly productId = 0x11ff;

    constructor(
        translocoService: TranslocoService,
        @Inject(CONTROLLERS_CONFIG) config: IControllersConfig
    ) {
        super(translocoService, 'steamDeck', config);
        this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'name'));
    }

    public controllerIdMatch(id: string): boolean {
        const vendorAndProduct = getGamepadVendorAndProduct(id);
        return vendorAndProduct?.vendorId === this.vendorId
            && vendorAndProduct?.productId === this.productId;
    }
}
