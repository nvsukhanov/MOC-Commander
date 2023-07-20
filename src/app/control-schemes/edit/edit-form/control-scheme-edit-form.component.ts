import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { ControlSchemeModel, } from '@app/store';
import { FeatureToolbarService, IScrollContainer, SCROLL_CONTAINER, ScreenSizeObserverService } from '@app/shared';
import { NgForOf } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';

import { ControlSchemeFormBuilderService } from './form-builders';
import { ControlSchemeEditForm } from '../types';
import { BindingComponent } from '../binding';
import { CONTROL_SCHEMES_FEATURE_SELECTORS } from '../../control-schemes-feature.selectors';

@Component({
    standalone: true,
    selector: 'app-control-scheme-edit-form',
    templateUrl: './control-scheme-edit-form.component.html',
    styleUrls: [ './control-scheme-edit-form.component.scss' ],
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        BindingComponent,
        PushPipe,
        TranslocoModule,
        MatButtonModule,
        NgForOf,
        LetDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnDestroy {
    @Output() public readonly save = new EventEmitter<ControlSchemeEditForm>();

    @Output() public readonly cancel = new EventEmitter<void>();

    public readonly form: ControlSchemeEditForm;

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEMES_FEATURE_SELECTORS.canAddBinding());

    public readonly bindingAvailabilityIoData$ = this.store.select(CONTROL_SCHEMES_FEATURE_SELECTORS.selectBindingEditAvailableOperationModes);

    public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

    public readonly isXsScreen$ = this.screenSizeObserverService.isXsScreen$;

    public readonly canSave$: Observable<boolean>;

    constructor(
        private readonly store: Store,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormBuilderService,
        private readonly cdRef: ChangeDetectorRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly featureToolbarService: FeatureToolbarService,
        @Inject(SCROLL_CONTAINER) private readonly scrollContainer: IScrollContainer,
    ) {
        this.form = this.controlSchemeFormFactoryService.createEditSchemeForm();
        this.canSave$ = this.form.valueChanges.pipe(
            startWith(this.form.value),
            map(() => {
                let isValid = true;
                for (const control of this.form.controls.bindings.controls) {
                    isValid = isValid && control.controls[control.controls.bindingFormOperationMode.value].valid;
                    if (!isValid) {
                        break;
                    }
                }
                return isValid && this.form.dirty;
            })
        );
    }

    @ViewChild('controlsTemplate', { static: true, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        if (controls) {
            this.featureToolbarService.setControls(controls);
        } else {
            this.featureToolbarService.clearConfig();
        }
    }

    @Input()
    public set scheme(
        scheme: ControlSchemeModel
    ) {
        this.form.reset();
        this.form.controls.id.patchValue(scheme.id);
        this.form.controls.name.patchValue(scheme.name);
        this.form.controls.bindings.clear();
        scheme.bindings.forEach((binding) => {
            const binging = this.controlSchemeFormFactoryService.createBindingForm(binding);
            this.form.controls.bindings.push(binging);
        });
        this.form.markAsPristine();
    }

    public onSave(): void {
        this.save.emit(this.form);
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearConfig();
    }

    public addBinding(): void {
        const binging = this.controlSchemeFormFactoryService.createBindingForm();
        this.form.controls.bindings.push(binging);
        this.form.controls.bindings.markAsDirty();
        this.cdRef.detectChanges();
        this.scrollContainer.scrollToBottom();
    }

    public deleteBindingAtIndex(
        index: number
    ): void {
        this.form.controls.bindings.removeAt(index);
        this.cdRef.markForCheck();
    }
}
