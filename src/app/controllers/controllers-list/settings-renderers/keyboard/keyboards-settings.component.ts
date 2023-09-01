import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, map, of, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { ControllerType, ToFormGroup } from '@app/shared';
import { KeyboardSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { ControlIgnoreInputComponent } from '../control-ignore-input';

@Component({
    standalone: true,
    selector: 'app-keyboards-settings',
    templateUrl: './keyboards-settings.component.html',
    styleUrls: [ './keyboards-settings.component.scss' ],
    imports: [
        ReactiveFormsModule,
        MatSlideToggleModule,
        TranslocoModule,
        MatIconModule,
        MatTooltipModule,
        NgIf,
        ControlIgnoreInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardsSettingsComponent implements IControllerSettingsRenderer<KeyboardSettingsModel> {
    public canSave$: Observable<boolean> = of(false);

    public formGroup?: ToFormGroup<KeyboardSettingsModel>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public loadSettings(
        settings: KeyboardSettingsModel
    ): void {
        this.formGroup = this.formBuilder.group({
            controllerId: this.formBuilder.control(settings.controllerId, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            controllerType: this.formBuilder.control(ControllerType.Keyboard, { nonNullable: true }) as FormControl<ControllerType.Keyboard>,
            captureNonAlphaNumerics: this.formBuilder.control(settings.captureNonAlphaNumerics, { nonNullable: true }),
            ignoreInput: this.formBuilder.control(settings.ignoreInput, { nonNullable: true })
        });

        this.canSave$ = this.formGroup.valueChanges.pipe(
            startWith(this.formGroup.value),
            map(() => !!(this.formGroup?.valid && this.formGroup?.dirty)),
        );
        this.cdRef.detectChanges();
    }

    public readSettings(): KeyboardSettingsModel | undefined {
        return this.formGroup?.getRawValue();
    }
}
