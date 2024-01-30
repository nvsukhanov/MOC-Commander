import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, startWith, take } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessagesDirective, WidgetType } from '@app/shared-misc';
import { ToggleControlComponent } from '@app/shared-ui';
import { TiltWidgetConfigModel } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

@Component({
    standalone: true,
    selector: 'feat-control-scheme-view-tilt-sensor-widget-settings',
    templateUrl: './tilt-sensor-widget-settings.component.html',
    styleUrls: [ './tilt-sensor-widget-settings.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoPipe,
        ValidationMessagesDirective,
        ToggleControlComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltSensorWidgetSettingsComponent implements OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<TiltWidgetConfigModel | undefined>();

    public readonly form = this.formBuilder.group({
        id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
        title: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
        hubId: this.commonFormBuilder.hubIdControl(),
        portId: this.commonFormBuilder.portIdControl(),
        modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
        valueChangeThreshold: this.formBuilder.control<number>(5, {
            validators: [
                Validators.required,
                Validators.min(5),
                Validators.max(30)
            ],
            nonNullable: true
        }),
        width: this.formBuilder.control<number>(2, { validators: Validators.required, nonNullable: true }),
        height: this.formBuilder.control<number>(2, { validators: Validators.required, nonNullable: true }),
        invertRoll: this.formBuilder.control<boolean>(false, { nonNullable: true }),
        invertPitch: this.formBuilder.control<boolean>(false, { nonNullable: true }),
        invertYaw: this.formBuilder.control<boolean>(false, { nonNullable: true }),
    });

    private configChangesSubscription?: Subscription;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService,
        private readonly commonFormBuilder: ControlSchemeFormBuilderService,
    ) {
    }

    @Input()
    public set config(
        config: TiltWidgetConfigModel | undefined
    ) {
        this.configChangesSubscription?.unsubscribe();
        if (config) {
            this.form.patchValue(config);
        } else {
            this.form.reset();
        }
        if (!this.form.controls.title.valid) {
            this.translocoService.selectTranslate('controlScheme.widgets.tilt.defaultName').pipe(
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

    public get config(): TiltWidgetConfigModel | undefined {
        if (this.form.controls.hubId.value === null
            || this.form.controls.portId.value === null
            || this.form.controls.modeId.value === null
            || this.form.invalid
        ) {
            return undefined;
        }
        return {
            widgetType: WidgetType.Tilt,
            id: this.form.controls.id.value,
            title: this.form.controls.title.value,
            hubId: this.form.controls.hubId.value,
            portId: this.form.controls.portId.value,
            modeId: this.form.controls.modeId.value,
            valueChangeThreshold: this.form.controls.valueChangeThreshold.value,
            width: this.form.controls.width.value,
            height: this.form.controls.height.value,
            invertRoll: this.form.controls.invertRoll.value,
            invertPitch: this.form.controls.invertPitch.value,
            invertYaw: this.form.controls.invertYaw.value,
        };
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }
}
