import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

import { IControllerProfile } from '../i-controller-profile';
import { createControllerL10nKey, createScopedControllerL10nKey } from '../create-controller-l10n-key';

export class UnknownControllerProfile implements IControllerProfile<null> {
    public readonly axisStateL10nKey = createControllerL10nKey('axisState');

    public readonly buttonStateL10nKey = createControllerL10nKey('buttonState');

    public readonly name$: Observable<string>;

    public readonly triggerButtonsIndices: ReadonlyArray<number> = [];

    private readonly l10nScope = 'unknown';

    constructor(
        private readonly translocoService: TranslocoService,
        public readonly uid: string
    ) {
        this.name$ = this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScope, 'name'), { uid });
    }

    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScope, 'axis'), { inputId });
    }

    public getButtonName$(
        inputId: string | number
    ): Observable<string> {
        return this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScope, 'button'), { inputId });
    }

    public getDefaultSettings(): null {
        return null;
    }
}
