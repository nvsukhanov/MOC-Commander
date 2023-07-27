import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { AccelerationProfileMixin, ControlSchemeModel, DecelerationProfileMixin, HUBS_SELECTORS, HubModel, attachedIosIdFn, } from '@app/store';
import { FeatureToolbarService, IScrollContainer, SCROLL_CONTAINER, ScreenSizeObserverService } from '@app/shared';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Dictionary } from '@ngrx/entity';

import { ControlSchemeFormBuilderService } from './form-builders';
import { ControlSchemeEditForm } from '../types';
import { BindingComponent } from '../binding';
import { CONTROL_SCHEMES_FEATURE_SELECTORS } from '../../control-schemes-feature.selectors';
import { ControlSchemeHubConfigurationComponent } from './hub-configuration';

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
        LetDirective,
        NgIf,
        JsonPipe,
        ControlSchemeHubConfigurationComponent
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

    public readonly knownHubs$: Observable<Dictionary<HubModel>> = this.store.select(HUBS_SELECTORS.selectEntities);

    public readonly canSave$: Observable<boolean>;

    private hubConfigurationsFormUpdateSub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormBuilderService,
        private readonly cdRef: ChangeDetectorRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly featureToolbarService: FeatureToolbarService,
        @Inject(SCROLL_CONTAINER) private readonly scrollContainer: IScrollContainer
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
                for (const control of this.form.controls.portConfigs.controls) { // TODO: why do we even need this?
                    isValid = isValid && control.valid;
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
        this.form.controls.id.setValue(scheme.id);
        this.form.controls.name.setValue(scheme.name);
        this.form.controls.bindings.clear();
        scheme.bindings.forEach((binding) => {
            const binging = this.controlSchemeFormFactoryService.createBindingForm(binding);
            this.form.controls.bindings.push(binging);
        });
        (scheme.portConfigs ?? []).forEach((hubConfig) => { // TODO: remove nullish coalescing when store version bumped
            const hubConfigForm = this.controlSchemeFormFactoryService.createPortConfigForm(hubConfig);
            this.form.controls.portConfigs.push(hubConfigForm);
        });
        this.hubConfigurationsFormUpdateSub?.unsubscribe();

        this.hubConfigurationsFormUpdateSub = this.form.controls.bindings.valueChanges.pipe(
            startWith(this.form.controls.bindings.value)
        ).subscribe(() => {
            this.updatePortsConfigurations();
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
        this.hubConfigurationsFormUpdateSub?.unsubscribe();
        this.hubConfigurationsFormUpdateSub = undefined;
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

    private updatePortsConfigurations(): void {
        // create port configs for all bindings that don't have one yet
        this.form.controls.bindings.controls.forEach((bindingControl) => {
            const actualBindingControl = bindingControl.controls[bindingControl.controls.bindingFormOperationMode.value];
            const hubConfigForm = this.form.controls.portConfigs.controls.find((hubConfig) =>
                hubConfig.controls.hubId.value === actualBindingControl.controls.hubId.value
                && hubConfig.controls.portId.value === actualBindingControl.controls.portId.value
            );
            if (!hubConfigForm) {
                const hubConfig = this.controlSchemeFormFactoryService.createPortConfigForm();
                hubConfig.controls.hubId.setValue(actualBindingControl.controls.hubId.value);
                hubConfig.controls.portId.setValue(actualBindingControl.controls.portId.value);
                this.form.controls.portConfigs.push(hubConfig);
            }
        });

        const rawFormValue = this.form.getRawValue();
        const accProfileEnabledIoIds = new Set<string>();
        const decProfileEnabledIoIds = new Set<string>();
        rawFormValue.bindings.forEach((binding) => {
            const bindingConfig = binding[binding.bindingFormOperationMode];
            if (this.hasAccelerationProfileMixin(bindingConfig) && bindingConfig.useAccelerationProfile) {
                accProfileEnabledIoIds.add(attachedIosIdFn(bindingConfig));
            }
            if (this.hasDecelerationProfileMixin(bindingConfig) && bindingConfig.useDecelerationProfile) {
                decProfileEnabledIoIds.add(attachedIosIdFn(bindingConfig));
            }
        });
        this.form.controls.portConfigs.controls.forEach((hubConfigForm) => {
            const rawValue = hubConfigForm.getRawValue();
            const shouldEnableAccProfile = accProfileEnabledIoIds.has(attachedIosIdFn(rawValue));
            const shouldEnableDecProfile = decProfileEnabledIoIds.has(attachedIosIdFn(rawValue));

            if (hubConfigForm.controls.useAccelerationProfile.value !== shouldEnableAccProfile) {
                hubConfigForm.controls.useAccelerationProfile.setValue(shouldEnableAccProfile);
            }

            if (hubConfigForm.controls.useDecelerationProfile.value !== shouldEnableDecProfile) {
                hubConfigForm.controls.useDecelerationProfile.setValue(shouldEnableDecProfile);
            }
        });
    }

    private hasAccelerationProfileMixin<T extends object>(
        binding: T
    ): binding is T & AccelerationProfileMixin {
        return Object.hasOwn(binding, 'useAccelerationProfile' satisfies keyof AccelerationProfileMixin);
    }

    private hasDecelerationProfileMixin<T extends object>(
        binding: T
    ): binding is T & DecelerationProfileMixin {
        return Object.hasOwn(binding, 'useDecelerationProfile' satisfies keyof DecelerationProfileMixin);
    }
}
