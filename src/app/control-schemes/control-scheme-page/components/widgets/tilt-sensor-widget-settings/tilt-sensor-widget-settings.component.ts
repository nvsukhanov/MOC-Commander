import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription, map, startWith, take } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeepPartial, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { TiltWidgetConfigModel, WidgetType } from '@app/store';

import { IControlSchemeWidgetSettingsComponent } from '../../widget-settings-container';
import { CommonFormControlsBuilderService } from '../../../../common';

@Component({
    standalone: true,
    selector: 'app-tilt-sensor-widget-settings',
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
export class TiltSensorWidgetSettingsComponent implements IControlSchemeWidgetSettingsComponent<TiltWidgetConfigModel>, OnDestroy {
    @Output() public readonly configChanges = new EventEmitter<TiltWidgetConfigModel>();

    @Output() public readonly valid: Observable<boolean>;

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
        private readonly commonFormBuilder: CommonFormControlsBuilderService,
    ) {
        this.valid = this.form.statusChanges.pipe(
            startWith(null),
            map(() => this.form.valid)
        );
    }

    @Input()
    public set config(
        config: DeepPartial<TiltWidgetConfigModel>
    ) {
        this.configChangesSubscription?.unsubscribe();
        this.form.patchValue(config);
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
            const result = this.getConfig();
            if (result !== null) {
                this.configChanges.emit(result);
            }
        });
    }

    public ngOnDestroy(): void {
        this.configChangesSubscription?.unsubscribe();
    }

    private getConfig(): TiltWidgetConfigModel | null {
        if (this.form.controls.hubId.value === null || this.form.controls.portId.value === null || this.form.controls.modeId.value === null) {
            return null;
        }
        return {
            widgetType: WidgetType.Tilt,
            id: this.form.controls.id.value,
            title: this.form.controls.title.value,
            hubId: this.form.controls.hubId.value!,
            portId: this.form.controls.portId.value!,
            modeId: this.form.controls.modeId.value,
            valueChangeThreshold: this.form.controls.valueChangeThreshold.value,
            width: this.form.controls.width.value,
            height: this.form.controls.height.value,
            invertRoll: this.form.controls.invertRoll.value,
            invertPitch: this.form.controls.invertPitch.value,
            invertYaw: this.form.controls.invertYaw.value,
        };
    }
}
