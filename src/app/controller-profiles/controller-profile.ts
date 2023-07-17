import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Memoize } from 'typescript-memoize';

import { createScopedControllerL10nKeyBuilder } from './create-controller-l10n-key';
import { IControllerProfile } from './i-controller-profile';

export abstract class ControllerProfile implements IControllerProfile {
    public abstract readonly uid: string;

    public abstract readonly nameL10nKey: string;

    public abstract readonly buttonStateL10nKey: string;

    public abstract readonly axisStateL10nKey: string;

    public abstract readonly triggerButtonsIndices: ReadonlyArray<number>;

    protected abstract axisNames: { readonly [k in string]: Observable<string> };

    protected abstract buttonNames: { readonly [k in string]: Observable<string> };

    private readonly l10nScopeKeyBuilder: (key: string) => string;

    private readonly genericGamepadL10nScopeKeyBuilder: (key: string) => string;

    protected constructor(
        protected readonly translocoService: TranslocoService,
        protected readonly l10nScopeName: string
    ) {
        this.l10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder(l10nScopeName);
        this.genericGamepadL10nScopeKeyBuilder = createScopedControllerL10nKeyBuilder('genericGamepad');
    }

    public abstract controllerIdMatch(id: string): boolean;

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.axisNames[inputId]
            ?? this.translocoService.selectTranslate(this.genericGamepadL10nScopeKeyBuilder('axis'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.buttonNames[inputId]
            ?? this.translocoService.selectTranslate(this.genericGamepadL10nScopeKeyBuilder('button'), { inputId });
    }

    protected getTranslation(
        key: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(this.l10nScopeKeyBuilder(key));
    }
}
