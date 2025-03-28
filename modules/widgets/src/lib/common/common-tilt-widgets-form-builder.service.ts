import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';
import { WidgetType } from '@app/shared-misc';

import { UnifiedTiltWidgetConfig } from './unified-tilt-widget-config';

export type CommonTiltWidgetsConfigForm = FormGroup<{
    id: FormControl<number>;
    title: FormControl<string>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    modeId: FormControl<number | null>;
    valueChangeThreshold: FormControl<number>;
    width: FormControl<number>;
    height: FormControl<number>;
    invert: FormControl<boolean>;
}>;

@Injectable()
export class CommonTiltWidgetsFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public buildPitchWidgetForm(): CommonTiltWidgetsConfigForm {
        return this.buildCommonForm();
    }

    public mapFormToTiltWidgetConfig(
        widgetType: WidgetType.Pitch | WidgetType.Yaw,
        form: CommonTiltWidgetsConfigForm
    ): UnifiedTiltWidgetConfig | undefined {
        if (form.controls.hubId.value === null ||
            form.controls.portId.value === null ||
            form.controls.modeId.value === null ||
            form.invalid
        ) {
            return undefined;
        }
        return {
            widgetType: widgetType,
            id: form.controls.id.value,
            title: form.controls.title.value,
            hubId: form.controls.hubId.value,
            portId: form.controls.portId.value,
            modeId: form.controls.modeId.value,
            valueChangeThreshold: form.controls.valueChangeThreshold.value,
            width: form.controls.width.value,
            height: form.controls.height.value,
            invert: form.controls.invert.value,
        };
    }

    private buildCommonForm(): CommonTiltWidgetsConfigForm {
        return this.formBuilder.group({
            id: this.formBuilder.control<number>(0, { validators: Validators.required, nonNullable: true }),
            title: this.formBuilder.control<string>('', { validators: [ Validators.required ], nonNullable: true }),
            hubId: this.commonFormBuilder.hubIdControl(),
            portId: this.commonFormBuilder.portIdControl(),
            modeId: this.formBuilder.control<number | null>(null, { validators: Validators.required, nonNullable: false }),
            valueChangeThreshold: this.formBuilder.control<number>(10, {
                validators: [
                    Validators.required,
                    Validators.min(5),
                    Validators.max(30)
                ],
                nonNullable: true
            }),
            width: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
            height: this.formBuilder.control<number>(1, { validators: Validators.required, nonNullable: true }),
            invert: this.formBuilder.control<boolean>(false, { nonNullable: true }),
        });
    }
}
