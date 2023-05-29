import { IControllerPlugin } from './i-controller-plugin';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { createControllerL10nKey, createScopedControllerL10nKey } from './create-controller-l10n-key';
import { Memoize } from 'typescript-memoize';

export abstract class ControllerPlugin implements IControllerPlugin {
    public abstract readonly nameL10nKey: string;

    public abstract readonly buttonStateL10nKey: string;

    public abstract readonly axisStateL10nKey: string;

    public abstract readonly triggerButtonIndices: ReadonlyArray<number>;

    protected abstract axisNames: { readonly [k in string]: Observable<string> };

    protected abstract buttonNames: { readonly [k in string]: Observable<string> };

    constructor(
        protected readonly translocoService: TranslocoService,
        protected readonly l10nScopeName: string
    ) {
    }

    public abstract controllerIdMatch(id: string): boolean;

    @Memoize()
    public getAxisName$(
        inputId: string
    ): Observable<string> {
        return this.axisNames[inputId]
            ?? this.translocoService.selectTranslate(createControllerL10nKey('genericGamepadAxisName'), { inputId });
    }

    @Memoize()
    public getButtonName$(
        inputId: string
    ): Observable<string> {
        return this.buttonNames[inputId]
            ?? this.translocoService.selectTranslate(createControllerL10nKey('genericGamepadAxisName'), { inputId });
    }

    protected getTranslation(
        key: string
    ): Observable<string> {
        return this.translocoService.selectTranslate(createScopedControllerL10nKey(this.l10nScopeName, key));
    }
}
