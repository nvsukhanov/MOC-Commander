import { ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatestWith, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { ValidationErrorsL10nMap } from './validation-errors-l10n-map';

@Directive({
    standalone: true,
    selector: '[appValidationErrorMapping]'
})
export class ValidationErrorMappingDirective implements OnChanges, OnDestroy {
    @Input() public control?: AbstractControl;

    private controlSubscription?: Subscription;

    private readonly l10nSubject = new BehaviorSubject<ValidationErrorsL10nMap>({});

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly renderer: Renderer2,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    @Input('appValidationErrorMapping')
    public set l10n(v: ValidationErrorsL10nMap) {
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
                combineLatestWith(this.l10nSubject),
                map(([ , l10n ]) => this.extractFirstErrorL10nKey(l10n)),
                switchMap((l10nKey) => l10nKey ? this.translocoService.selectTranslate(l10nKey) : of(null)),
                distinctUntilChanged()
            ).subscribe((result) => {
                this.renderer.setProperty(this.elementRef.nativeElement, 'innerText', result ?? '');
                this.cdRef.detectChanges();
            });
        }
    }

    private extractFirstErrorL10nKey(
        l10nMap: ValidationErrorsL10nMap
    ): string | undefined {
        if (!this.control) {
            return undefined;
        }
        if (this.control && this.control.invalid) {
            const errors = this.control.errors as ValidationErrors;
            for (const errorName in errors) {
                if (errorName && l10nMap[errorName]) {
                    return l10nMap[errorName];
                }
            }
        }
        return undefined;
    }
}
