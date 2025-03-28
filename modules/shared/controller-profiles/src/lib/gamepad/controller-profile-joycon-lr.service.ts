import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';
import { CONTROLLERS_CONFIG, IControllersConfig } from '../i-controllers-config';
import { getGamepadVendorAndProduct } from '../get-gamepad-vendor-and-product';

@Injectable()
export class ControllerProfileJoyconLrService extends GamepadProfile {
  public readonly uid = 'joycon-lr';

  public name$: Observable<string>;

  public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

  public readonly axisStateL10nKey = createControllerL10nKey('axisState');

  public readonly triggerButtonsIndices: ReadonlyArray<number> = [6, 7];

  protected readonly invertedAxisIndices: ReadonlyArray<number> = [1, 3];

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

  private readonly vendorId = 0x057e;

  private readonly productId = 0x200e;

  constructor(translocoService: TranslocoService, @Inject(CONTROLLERS_CONFIG) config: IControllersConfig) {
    super(translocoService, 'joycon', config);
    this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'combined'));
  }

  public controllerIdMatch(id: string): boolean {
    const vendorAndProduct = getGamepadVendorAndProduct(id);
    return vendorAndProduct?.vendorId === this.vendorId && vendorAndProduct?.productId === this.productId;
  }
}
