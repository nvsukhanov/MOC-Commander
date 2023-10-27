import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { VoltageWidgetConfigModel, WidgetType } from '@app/store';

import { IControlSchemeWidgetSettingsComponent } from '../../widget-settings-container';
import { CommonFormControlsBuilderService } from '../../../../common';

@Component({
    standalone: true,
    selector: 'app-voltage-sensor-widget-settings',
    templateUrl: './voltage-sensor-widget-settings.component.html',
    styleUrls: [ './voltage-sensor-widget-settings.component.scss' ],
    imports: [
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoltageSensorWidgetSettingsComponent implements IControlSchemeWidgetSettingsComponent<VoltageWidgetConfigModel> {
    @Output() public readonly save$ = new EventEmitter<VoltageWidgetConfigModel>();

    public canSave$: Observable<boolean>;

    public readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
        order: this.formBuilder.control<number>(0, { nonNullable: true }),
        hubId: this.commonFormBuilder.hubIdControl(),
        portId: this.commonFormBuilder.portIdControl(),
        modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
        valueChangeThreshold: this.formBuilder.control<number>(5, {
            validators: [
                Validators.required,
                Validators.min(0.01),
            ],
            nonNullable: true
        }),
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormBuilder: CommonFormControlsBuilderService
    ) {
        this.canSave$ = this.form.statusChanges.pipe(
            startWith(null),
            map(() => this.form.valid)
        );
    }

    public useConfig(
        config: VoltageWidgetConfigModel
    ): void {
        this.form.patchValue(config);
    }

    public getConfig(): VoltageWidgetConfigModel {
        if (!this.form.valid) {
            throw new Error('Form is invalid');
        }
        return {
            widgetType: WidgetType.Voltage,
            id: this.form.controls.order.value,
            name: this.form.controls.name.value,
            hubId: this.form.controls.hubId.value!,
            portId: this.form.controls.portId.value!,
            modeId: this.form.controls.modeId.value!,
            valueChangeThreshold: this.form.controls.valueChangeThreshold.value,
        };
    }
}
