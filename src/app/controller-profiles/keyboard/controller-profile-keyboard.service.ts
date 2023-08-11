import { EMPTY, Observable } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControllerType } from '@app/shared';

import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';
import { IControllerProfile } from '../i-controller-profile';
import { KeyboardSettings } from '../controller-settings';

@Injectable()
export class ControllerProfileKeyboardService implements IControllerProfile<KeyboardSettings> {
    public readonly uid = 'keyboard';

    public readonly name$: Observable<string>;

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [];

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    private readonly l10nScope = 'keyboard';

    private readonly axisName = EMPTY;

    constructor(
        private readonly translocoService: TranslocoService
    ) {
        this.name$ = this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScope, 'name'));
    }

    public getAxisName$(): Observable<string> {
        return this.axisName;
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScope, 'button'), { inputId });
    }

    public getDefaultSettings(): KeyboardSettings {
        return {
            controllerType: ControllerType.Keyboard,
            captureNonAlphaNumerics: false
        };
    }
}
