import { ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatestWith, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { ValidationErrorsL10nMap } from './validation-errors-l10n-map';
import { COMMON_VALIDATION_ERRORS_L10N_MAP } from './common-validation-errors-l10n-map';

@Directive({
    standalone: true,
    selector: '[libValidationMessages]'
})
export class ValidationMessagesDirective implements OnChanges, OnDestroy {
    @Input('libValidationMessages') public control?: AbstractControl;

    private controlSubscription?: Subscription;

    private readonly commonValidationErrorsL10nMap: ValidationErrorsL10nMap = COMMON_VALIDATION_ERRORS_L10N_MAP;

    private readonly l10nSubject = new BehaviorSubject<ValidationErrorsL10nMap>({});

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly renderer: Renderer2,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly cdRef: ChangeDetectorRef,
    ) {
    }

    @Input()
    public set l10nMap(v: ValidationErrorsL10nMap) {
        this.l10nSubject.next(v);
    }

    public ngOnDestroy(): void {
        this.controlSubscription?.unsubscribe();
    }

    public ngOnChanges(): void {
        this.controlSubscription?.unsubscribe();
        if (this.control) {
            this.trackControlErrors();
        }
    }

    private trackControlErrors(): void {
        this.controlSubscription?.unsubscribe();
        if (this.control) {
            this.controlSubscription = this.control.statusChanges.pipe(
                startWith(null),
                combineLatestWith(this.l10nSubject),
                map(([ , l10n ]) => this.extractFirstErrorData(l10n)),
                switchMap((errorData) => errorData ? this.translocoService.selectTranslate(errorData.l10nKey, errorData.payload) : of(null)),
                distinctUntilChanged()
            ).subscribe((result: string | null) => {
                this.renderer.setProperty(this.elementRef.nativeElement, 'innerText', result ?? '');
                this.cdRef.detectChanges();
            });
        }
    }

    private extractFirstErrorData(
        l10nMap: ValidationErrorsL10nMap
    ): {
        l10nKey: string;
        payload: object;
    } | undefined {
        if (!this.control) {
            return undefined;
        }
        if (this.control && this.control.dirty && this.control.invalid) {
            const error = Object.keys(this.control.errors ?? {})[0];
            if (error !== undefined) {
                const payload = this.control.errors?.[error] instanceof Object ? this.control.errors?.[error] : { value: this.control.errors?.[error] };
                return {
                    l10nKey: l10nMap[error] || this.commonValidationErrorsL10nMap[error] || error,
                    payload
                };
            }
        }
        return undefined;
    }
}
