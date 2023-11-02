import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, map, startWith, take } from 'rxjs';
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
export class VoltageSensorWidgetSettingsComponent implements IControlSchemeWidgetSettingsComponent<VoltageWidgetConfigModel>, OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<VoltageWidgetConfigModel>();

    @Output() public valid: Observable<boolean>;

    public readonly form = this.formBuilder.group({
        id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
        title: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
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
        width: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
        height: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
    });

    private configChangesSubscription?: Subscription;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormBuilder: CommonFormControlsBuilderService,
        private readonly translocoService: TranslocoService,
    ) {
        this.valid = this.form.statusChanges.pipe(
            startWith(null),
            map(() => this.form.valid)
        );
    }

    @Input()
    public set config(
        config: VoltageWidgetConfigModel
    ) {
        this.configChangesSubscription?.unsubscribe();
        this.form.patchValue(config);
        if (!this.form.controls.title.valid) {
            this.translocoService.selectTranslate('controlScheme.widgets.voltage.defaultName').pipe(
                take(1)
            ).subscribe((name) => {
                this.form.controls.title.setValue(name);
                this.configChangesSubscription = this.form.valueChanges.pipe(
                    startWith(null)
                ).subscribe(() => {
                    const result = this.getConfig();
                    if (result !== null) {
                        this.configChanges.emit(result);
                    }
                });
            });
        }
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }

    private getConfig(): VoltageWidgetConfigModel | null {
        if (this.form.controls.hubId.value === null || this.form.controls.portId.value === null || this.form.controls.modeId.value === null) {
            return null;
        }
        return {
            widgetType: WidgetType.Voltage,
            id: this.form.controls.id.value,
            title: this.form.controls.title.value,
            hubId: this.form.controls.hubId.value,
            portId: this.form.controls.portId.value,
            modeId: this.form.controls.modeId.value,
            valueChangeThreshold: this.form.controls.valueChangeThreshold.value,
            width: this.form.controls.width.value,
            height: this.form.controls.height.value,
        };
    }
}
