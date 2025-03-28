import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

import { GamepadProfile } from '../gamepad-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';
import { CONTROLLERS_CONFIG, IControllersConfig } from '../i-controllers-config';
import { getGamepadVendorAndProduct } from '../get-gamepad-vendor-and-product';

@Injectable()
export class ControllerProfileJoyconRService extends GamepadProfile {
  public readonly uid = 'joycon-r';

  public name$: Observable<string>;

  public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

  public readonly axisStateL10nKey = createControllerL10nKey('axisState');

  public readonly triggerButtonsIndices: ReadonlyArray<number> = [6, 7];

  protected readonly invertedAxisIndices: ReadonlyArray<number> = [1];

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
    7: this.getTranslation('zrTrigger'),
    8: this.getTranslation('zlTrigger'),
    9: this.getTranslation('buttonPlus'),
    10: this.getTranslation('buttonRStick'),
    16: this.getTranslation('buttonHome'),
  };

  private readonly vendorId = 0x057e;

  private readonly productId = 0x2007;

  constructor(translocoService: TranslocoService, @Inject(CONTROLLERS_CONFIG) config: IControllersConfig) {
    super(translocoService, 'joycon', config);
    this.name$ = translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, 'r-name'));
  }

  public controllerIdMatch(id: string): boolean {
    const vendorAndProduct = getGamepadVendorAndProduct(id);
    return vendorAndProduct?.vendorId === this.vendorId && vendorAndProduct?.productId === this.productId;
  }
}
