import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeyboardSettingsModel } from '@app/store';

import { IControllerSettingsComponent } from '../i-controller-settings-component';

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
        MatTooltipModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardsSettingsComponent implements IControllerSettingsComponent<KeyboardSettingsModel>, OnDestroy {
    public formGroup: FormGroup<{
        controllerId: FormControl<string>;
        captureNonAlphaNumerics: FormControl<boolean>;
    }>;

    private readonly defaultCaptureNonAlphaNumerics = false;

    private settingsChangesFn?: (settings: KeyboardSettingsModel) => void;

    private formChangeSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
    ) {
        this.formGroup = this.formBuilder.group({
            controllerId: this.formBuilder.control('', { nonNullable: true }),
            captureNonAlphaNumerics: this.formBuilder.control(this.defaultCaptureNonAlphaNumerics, { nonNullable: true })
        });

        this.formChangeSubscription = this.formGroup.valueChanges.subscribe(() => {
            if (this.settingsChangesFn) {
                this.settingsChangesFn(this.formGroup.getRawValue());
            }
        });
    }

    public ngOnDestroy(): void {
        this.formChangeSubscription.unsubscribe();
    }

    public loadSettings(
        settings: KeyboardSettingsModel
    ): void {
        this.formGroup.patchValue(settings, { emitEvent: false });
    }

    public registerSettingsChangesFn(
        settingChanges: (settings: KeyboardSettingsModel) => void
    ): void {
        this.settingsChangesFn = settingChanges;
    }
}
