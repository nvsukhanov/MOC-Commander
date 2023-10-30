import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, startWith, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { VoltageWidgetConfigModel, WidgetType } from '@app/store';
import { ValidationMessagesDirective } from '@app/shared';

import { IControlSchemeWidgetSettingsComponent } from '../../widget-settings-container';
import { CommonFormControlsBuilderService } from '../../../../common';

@Component({
    standalone: true,
    selector: 'app-voltage-sensor-widget-settings',
    templateUrl: './voltage-sensor-widget-settings.component.html',
    styleUrls: [ './voltage-sensor-widget-settings.component.scss' ],
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        ValidationMessagesDirective,
        TranslocoPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoltageSensorWidgetSettingsComponent implements IControlSchemeWidgetSettingsComponent<VoltageWidgetConfigModel> {
    @Output() public readonly save = new EventEmitter<VoltageWidgetConfigModel>();

    public canSave$: Observable<boolean>;

    public readonly form = this.formBuilder.group({
        id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
        name: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
        hubId: this.commonFormBuilder.hubIdControl(),
        portId: this.commonFormBuilder.portIdControl(),
        modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
        valueChangeThreshold: this.formBuilder.control<number>(5, {
            validators: [
                Validators.required,
                Validators.min(0.01),
                Validators.max(100)
            ],
            nonNullable: true
        }),
    });

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormBuilder: CommonFormControlsBuilderService,
        private readonly translocoService: TranslocoService,
    ) {
        this.canSave$ = this.form.statusChanges.pipe(
            startWith(null),
            map(() => this.form.valid)
        );
        this.translocoService.selectTranslate('controlScheme.widgets.voltage.defaultName').pipe(
            take(1)
        ).subscribe((name) => {
            this.form.controls.name.setValue(name);
        });
    }

    public useConfig(
        config: VoltageWidgetConfigModel
    ): void {
        this.form.patchValue(config);
    }

    public onSubmit(
        event: Event
    ): void {
        event.preventDefault();
        if (this.form.valid) {
            this.save.emit(this.getConfig());
        }
    }

    public getConfig(): VoltageWidgetConfigModel {
        if (this.form.controls.hubId.value === null || this.form.controls.portId.value === null || this.form.controls.modeId.value === null) {
            throw new Error('Form is invalid');
        }
        return {
            widgetType: WidgetType.Voltage,
            id: this.form.controls.id.value,
            name: this.form.controls.name.value,
            hubId: this.form.controls.hubId.value,
            portId: this.form.controls.portId.value,
            modeId: this.form.controls.modeId.value,
            valueChangeThreshold: this.form.controls.valueChangeThreshold.value,
        };
    }
}
