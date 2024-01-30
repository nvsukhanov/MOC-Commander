import { ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, distinctUntilChanged, map, startWith } from 'rxjs';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';
import { IBindingDetailsEditFormRenderer } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from './i-bindings-details-edit-component';
import { BindingSetSpeedEditComponent, SetSpeedBindingFormBuilderService, SetSpeedBindingFormMapperService } from './set-speed';
import { BindingServoEditComponent, ServoBindingFormBuilderService, ServoBindingFormMapperService } from './servo';
import { BindingSetAngleEditComponent, SetAngleBindingFormBuilderService, SetAngleBindingFormMapperService } from './set-angle';
import { BindingStepperEditComponent, StepperBindingFormBuilderService, StepperBindingFormMapperService } from './stepper';
import { BindingTrainControlEditComponent, TrainControlBindingFormBuilderService, TrainControlBindingFormMapperService } from './train-control';
import { BindingGearboxControlEditComponent, GearboxControlBindingFormBuilderService, GearboxControlBindingFormMapperService } from './gearbox';

export class BindingDetailsEditFormRenderer implements IBindingDetailsEditFormRenderer {
    public readonly bindingChange: Observable<ControlSchemeBinding | null>;

    private readonly renderers: { [k in ControlSchemeBindingType]: Type<IBindingsDetailsEditComponent> | null } = {
        [ControlSchemeBindingType.SetSpeed]: BindingSetSpeedEditComponent,
        [ControlSchemeBindingType.Servo]: BindingServoEditComponent,
        [ControlSchemeBindingType.SetAngle]: BindingSetAngleEditComponent,
        [ControlSchemeBindingType.Stepper]: BindingStepperEditComponent,
        [ControlSchemeBindingType.TrainControl]: BindingTrainControlEditComponent,
        [ControlSchemeBindingType.GearboxControl]: BindingGearboxControlEditComponent
    };

    private _bindingType =  ControlSchemeBindingType.SetSpeed;

    private renderer?: ComponentRef<IBindingsDetailsEditComponent>;

    private readonly _form = this.formBuilder.group({
        id: this.formBuilder.control<number>(0, {
            nonNullable: true,
            validators: [
                Validators.required
            ]
        }),
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedBindingFormBuilder.build(),
        [ControlSchemeBindingType.Servo]: this.servoBindingFormBuilder.build(),
        [ControlSchemeBindingType.SetAngle]: this.setAngleBindingFormBuilder.build(),
        [ControlSchemeBindingType.Stepper]: this.stepperBindingFormBuilder.build(),
        [ControlSchemeBindingType.TrainControl]: this.trainControlBindingFormBuilder.build(),
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControlBindingFormBuilder.build()
    });

    constructor(
        private readonly container: ViewContainerRef,
        private readonly formBuilder: FormBuilder,
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly setSpeedBindingFormBuilder: SetSpeedBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly trainControlBindingFormBuilder: TrainControlBindingFormBuilderService,
        private readonly gearboxControlBindingFormBuilder: GearboxControlBindingFormBuilderService,
        private readonly setSpeedBindingMapper: SetSpeedBindingFormMapperService,
        private readonly servoBindingMapper: ServoBindingFormMapperService,
        private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
        private readonly stepperBindingMapper: StepperBindingFormMapperService,
        private readonly trainControlBindingMapper: TrainControlBindingFormMapperService,
        private readonly gearboxControlBindingMapper: GearboxControlBindingFormMapperService
    ) {
        this.bindingChange = this._form.valueChanges.pipe(
            startWith(null),
            map(() => {
                const form = this._form.controls[this._bindingType];
                return form.valid && form.dirty ? this.mapFormToModel() : null;
            }),
            distinctUntilChanged()
        );
    }

    /**
     * Renders specified binding type
     * @param bindingType
     */
    public setBindingType(
        bindingType: ControlSchemeBindingType
    ): void {
        this._bindingType = bindingType;
        this.updateRenderer();
    }

    /**
     * Injects binding into form
     * @param binding
     */
    public setBinding(
        binding: Partial<ControlSchemeBinding> | undefined
    ): void {
        this._form.reset();
        if (binding) {
            this.patchForm(binding);
        }
        this._form.updateValueAndValidity({ emitEvent: true });
        this.updateRenderer();
    }

    public dispose(): void {
        this.renderer?.destroy();
    }

    private updateRenderer(): void {
        if (this._bindingType === undefined || this._form == undefined) {
            return;
        }
        const renderer = this.renderers[this._bindingType];
        if (!renderer) {
            this.renderer?.destroy();
            this.renderer = undefined;
            return;
        }

        if (!(this.renderer?.instance instanceof renderer)) {
            this.renderer?.destroy();
            this.renderer = undefined;

            this.renderer = this.container.createComponent(renderer);
        }

        this.renderer.instance.setForm(this._form.controls[this._bindingType]);
    }

    private patchForm(
        patch: DeepPartial<ControlSchemeBinding>
    ): void {
        if (patch.id !== undefined) {
            this._form.controls.id.setValue(patch.id);
        }
        switch (patch.bindingType) {
            case ControlSchemeBindingType.SetSpeed:
                this.setSpeedBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.SetSpeed], patch);
                break;
            case ControlSchemeBindingType.Servo:
                this.servoBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Servo], patch);
                break;
            case ControlSchemeBindingType.SetAngle:
                this.setAngleBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.SetAngle], patch);
                break;
            case ControlSchemeBindingType.Stepper:
                this.stepperBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Stepper], patch);
                break;
            case ControlSchemeBindingType.TrainControl:
                this.trainControlBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.TrainControl], patch);
                break;
            case ControlSchemeBindingType.GearboxControl:
                this.gearboxControlBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.GearboxControl], patch);
                break;
            default:
                return patch.bindingType satisfies void;
        }
    }

    private mapFormToModel(): ControlSchemeBinding {
        const id = this._form.controls.id.value;
        switch (this._bindingType) {
            case ControlSchemeBindingType.SetSpeed:
                return this.setSpeedBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.SetSpeed]);
            case ControlSchemeBindingType.Servo:
                return this.servoBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Servo]);
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.SetAngle]);
            case ControlSchemeBindingType.Stepper:
                return this.stepperBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Stepper]);
            case ControlSchemeBindingType.TrainControl:
                return this.trainControlBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.TrainControl]);
            case ControlSchemeBindingType.GearboxControl:
                return this.gearboxControlBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.GearboxControl]);
            case undefined:
                throw new Error('Binding type is undefined');
            default:
                return this._bindingType satisfies void;
        }
    }
}
