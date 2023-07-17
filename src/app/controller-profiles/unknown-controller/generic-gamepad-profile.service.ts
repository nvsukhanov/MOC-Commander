import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { Memoize } from 'typescript-memoize';

import { IControllerProfile } from '../i-controller-profile';
import { createControllerL10nKey, createScopedControllerL10nKeyBuilder } from '../create-controller-l10n-key';

@Injectable()
export class GenericGamepadProfileService implements IControllerProfile {
    public readonly uid: string = 'generic-gamepad';

    public readonly nameL10nKey: string;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonsIndices = [];

    private readonly l10nScopeKeyBuilder: (key: string) => string;

    constructor(
        private readonly translocoService: TranslocoService
    ) {
        this.l10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder('genericGamepad');
        this.nameL10nKey = this.l10nScopeKeyBuilder('name');
    }

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder('axis'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder('button'), { inputId });
    }
}
