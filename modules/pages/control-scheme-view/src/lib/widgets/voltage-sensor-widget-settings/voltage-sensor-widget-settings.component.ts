import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, startWith, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { ValidationMessagesDirective, WidgetType } from '@app/shared-misc';
import { VoltageWidgetConfigModel } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-voltage-sensor-widget-settings',
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
export class VoltageSensorWidgetSettingsComponent implements OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<VoltageWidgetConfigModel | undefined>();

    public readonly form = this.formBuilder.group({
        id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
        title: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
        hubId: this.commonFormBuilder.hubIdControl(),
        portId: this.commonFormBuilder.portIdControl(),
        modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
        valueChangeThreshold: this.formBuilder.control<number>(0.05, {
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
        private readonly commonFormBuilder: ControlSchemeFormBuilderService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    @Input()
    public set config(
        config: VoltageWidgetConfigModel | undefined
    ) {
        this.configChangesSubscription?.unsubscribe();
        if (config) {
            this.form.patchValue(config);
        } else {
            this.form.reset();
        }
        if (!this.form.controls.title.valid) {
            this.translocoService.selectTranslate('controlScheme.widgets.voltage.defaultName').pipe(
                take(1)
            ).subscribe((name) => {
                this.form.controls.title.setValue(name);
            });
        }
        this.configChangesSubscription = this.form.valueChanges.pipe(
            startWith(null)
        ).subscribe(() => {
            this.configChanges.emit(this.config);
        });
    }

    public get config(): VoltageWidgetConfigModel | undefined {
        if (this.form.controls.hubId.value === null
            || this.form.controls.portId.value === null
            || this.form.controls.modeId.value === null
            || this.form.invalid
        ) {
            return undefined;
        }
        return {
            widgetType: WidgetType.Voltage,
            id: this.form.controls.id.value,
            title: this.form.controls.title.value,
            hubId: this.form.controls.hubId.value,
            portId: this.form.controls.portId.value,
            modeId: this.form.controls.modeId.value,
            valueChangeThreshold: +this.form.controls.valueChangeThreshold.value,
            width: this.form.controls.width.value,
            height: this.form.controls.height.value,
        };
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }
}
