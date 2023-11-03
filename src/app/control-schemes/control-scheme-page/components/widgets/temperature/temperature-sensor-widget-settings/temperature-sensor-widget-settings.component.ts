import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription, map, startWith, take } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TemperatureWidgetConfigModel, WidgetType } from '@app/store';
import { ValidationMessagesDirective } from '@app/shared';

import { CommonFormControlsBuilderService } from '../../../../../common';
import { IControlSchemeWidgetSettingsComponent } from '../../../widget-settings-container';

@Component({
    standalone: true,
    selector: 'app-temperature-sensor-widget-settings',
    templateUrl: './temperature-sensor-widget-settings.component.html',
    styleUrls: [ './temperature-sensor-widget-settings.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoPipe,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureSensorWidgetSettingsComponent implements IControlSchemeWidgetSettingsComponent<TemperatureWidgetConfigModel>,
    OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<TemperatureWidgetConfigModel>();

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
                Validators.min(0.1),
                Validators.max(10)
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
        config: TemperatureWidgetConfigModel
    ) {
        this.configChangesSubscription?.unsubscribe();
        this.form.patchValue(config);
        if (!this.form.controls.title.valid) {
            this.translocoService.selectTranslate('controlScheme.widgets.temperature.defaultName').pipe(
                take(1)
            ).subscribe((name) => {
                this.form.controls.title.setValue(name);
            });
        }
        this.configChangesSubscription = this.form.valueChanges.pipe(
            startWith(null)
        ).subscribe(() => {
            const result = this.getConfig();
            if (result !== null) {
                this.configChanges.emit(result);
            }
        });
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }

    private getConfig(): TemperatureWidgetConfigModel | null {
        if (this.form.controls.hubId.value === null || this.form.controls.portId.value === null || this.form.controls.modeId.value === null) {
            return null;
        }
        return {
            widgetType: WidgetType.Temperature,
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
