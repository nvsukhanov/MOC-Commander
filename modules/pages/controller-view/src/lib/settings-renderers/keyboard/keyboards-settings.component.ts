import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable, map } from 'rxjs';
import { ControllerType } from '@app/controller-profiles';
import { ToFormGroup } from '@app/shared-misc';
import { KeyboardSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { ControlIgnoreInputComponent } from '../control-ignore-input';

@Component({
    standalone: true,
    selector: 'page-controller-view-keyboards-settings',
    templateUrl: './keyboards-settings.component.html',
    styleUrls: [ './keyboards-settings.component.scss' ],
    imports: [
        ReactiveFormsModule,
        MatSlideToggleModule,
        TranslocoPipe,
        ControlIgnoreInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardsSettingsComponent implements IControllerSettingsRenderer<KeyboardSettingsModel> {
    public formGroup: ToFormGroup<KeyboardSettingsModel>;

    public settingsChanges$: Observable<KeyboardSettingsModel>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly cdRef: ChangeDetectorRef
    ) {
        this.formGroup = this.formBuilder.group({
            controllerId: this.formBuilder.control('', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            controllerType: this.formBuilder.control(ControllerType.Keyboard, { nonNullable: true }) as FormControl<ControllerType.Keyboard>,
            captureNonAlphaNumerics: this.formBuilder.control(false, { nonNullable: true }),
            ignoreInput: this.formBuilder.control(false, { nonNullable: true })
        });
        this.settingsChanges$ = this.formGroup.valueChanges.pipe(
            map(() => this.formGroup.getRawValue())
        );
    }

    public loadSettings(
        settings: KeyboardSettingsModel
    ): void {
        this.formGroup.patchValue(settings, { emitEvent: false });
        this.cdRef.detectChanges();
    }
}
