import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { HubControllerSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { ControlIgnoreInputComponent } from '../control-ignore-input';

@Component({
    standalone: true,
    selector: 'page-controller-view-hub-controller-settings',
    templateUrl: './hub-controller-settings.component.html',
    styleUrls: [ './hub-controller-settings.component.scss' ],
    imports: [
        ControlIgnoreInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubControllerSettingsComponent implements IControllerSettingsRenderer<HubControllerSettingsModel> {
    public readonly ignoreInputControl: FormControl<boolean>;

    public readonly settingsChanges$: Observable<HubControllerSettingsModel>;

    private settings?: HubControllerSettingsModel;

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
        this.ignoreInputControl = this.formBuilder.control(
            false,
            { nonNullable: true }
        );
        this.settingsChanges$ = this.ignoreInputControl.valueChanges.pipe(
            map(() => {
                if (!this.settings) {
                    return;
                }
                return {
                    ...this.settings,
                    ignoreInput: this.ignoreInputControl.value
                };
            }),
            filter((settings): settings is HubControllerSettingsModel => !!settings)
        );
    }

    public loadSettings(
        settings: HubControllerSettingsModel
    ): void {
        this.settings = settings;
        this.ignoreInputControl.setValue(settings.ignoreInput, { emitEvent: false });
    }
}
