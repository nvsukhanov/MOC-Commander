import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { HubControllerSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { ControlIgnoreInputComponent } from '../control-ignore-input';

@Component({
    standalone: true,
    selector: 'app-hub-controller-settings',
    templateUrl: './hub-controller-settings.component.html',
    styleUrls: [ './hub-controller-settings.component.scss' ],
    imports: [
        ControlIgnoreInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubControllerSettingsComponent implements IControllerSettingsRenderer<HubControllerSettingsModel> {
    public readonly canSave$: Observable<boolean>;

    public readonly ignoreInputControl: FormControl<boolean>;

    private settings?: HubControllerSettingsModel;

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
        this.ignoreInputControl = this.formBuilder.control(
            false,
            { nonNullable: true }
        );
        this.canSave$ = this.ignoreInputControl.valueChanges.pipe(
            map(() => this.ignoreInputControl.dirty)
        );
    }

    public loadSettings(
        settings: HubControllerSettingsModel
    ): void {
        this.settings = settings;
        this.ignoreInputControl.setValue(settings.ignoreInput);
    }

    public readSettings(): HubControllerSettingsModel | undefined {
        if (!this.settings) {
            return undefined;
        }
        return {
            ...this.settings,
            ignoreInput: this.ignoreInputControl.value
        };
    }

}
