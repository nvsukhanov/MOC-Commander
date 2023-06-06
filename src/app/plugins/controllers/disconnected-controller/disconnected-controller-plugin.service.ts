import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { Memoize } from 'typescript-memoize';

import { IControllerPlugin } from '../i-controller-plugin';
import { createControllerL10nKey } from '../create-controller-l10n-key';

@Injectable()
export class DisconnectedControllerPluginService implements IControllerPlugin {
    public readonly nameL10nKey: string;

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly triggerButtonIndices = [];

    constructor(
        private readonly translocoService: TranslocoService
    ) {
        this.nameL10nKey = createControllerL10nKey('disconnectedController');
    }

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(createControllerL10nKey('disconnectedControllerAxis'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(createControllerL10nKey('disconnectedControllerButton'), { inputId });
    }
}
