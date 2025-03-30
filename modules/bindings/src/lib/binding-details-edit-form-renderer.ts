import { ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, distinctUntilChanged, map, startWith } from 'rxjs';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { IBindingDetailsEditFormRenderer } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from './i-bindings-details-edit-component';
import { SpeedBindingEditComponent, SpeedBindingFormBuilderService, SpeedBindingFormMapperService } from './speed';
import { ServoBindingEditComponent, ServoBindingFormBuilderService, ServoBindingFormMapperService } from './servo';
import {
  SetAngleBindingEditComponent,
  SetAngleBindingFormBuilderService,
  SetAngleBindingFormMapperService,
} from './set-angle';
import {
  StepperBindingEditComponent,
  StepperBindingFormBuilderService,
  StepperBindingFormMapperService,
} from './stepper';
import { TrainBindingEditComponent, TrainBindingFormBuilderService, TrainBindingFormMapperService } from './train';
import {
  GearboxBindingEditComponent,
  GearboxBindingFormBuilderService,
  GearboxBindingFormMapperService,
} from './gearbox';
import {
  AccelerateBindingEditComponent,
  AccelerateBindingFormBuilderService,
  AccelerateBindingFormMapperService,
} from './accelerate';
import { PowerBindingEditComponent, PowerBindingFormBuilderService, PowerBindingFormMapperService } from './power';

export class BindingDetailsEditFormRenderer implements IBindingDetailsEditFormRenderer {
  public readonly bindingChange: Observable<ControlSchemeBinding | null>;

  public readonly bindingFormDirtyChange: Observable<boolean>;

  private readonly renderers: { [k in ControlSchemeBindingType]: Type<IBindingsDetailsEditComponent> | null } = {
    [ControlSchemeBindingType.Speed]: SpeedBindingEditComponent,
    [ControlSchemeBindingType.Servo]: ServoBindingEditComponent,
    [ControlSchemeBindingType.SetAngle]: SetAngleBindingEditComponent,
    [ControlSchemeBindingType.Stepper]: StepperBindingEditComponent,
    [ControlSchemeBindingType.Train]: TrainBindingEditComponent,
    [ControlSchemeBindingType.Gearbox]: GearboxBindingEditComponent,
    [ControlSchemeBindingType.Accelerate]: AccelerateBindingEditComponent,
    [ControlSchemeBindingType.Power]: PowerBindingEditComponent,
  };

  private _bindingType = ControlSchemeBindingType.Speed;

  private renderer?: ComponentRef<IBindingsDetailsEditComponent>;

  private readonly _form = this.formBuilder.group({
    id: this.formBuilder.control<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ControlSchemeBindingType.Speed]: this.speedBindingFormBuilder.build(),
    [ControlSchemeBindingType.Servo]: this.servoBindingFormBuilder.build(),
    [ControlSchemeBindingType.SetAngle]: this.setAngleBindingFormBuilder.build(),
    [ControlSchemeBindingType.Stepper]: this.stepperBindingFormBuilder.build(),
    [ControlSchemeBindingType.Train]: this.trainBindingFormBuilder.build(),
    [ControlSchemeBindingType.Gearbox]: this.gearboxBindingFormBuilder.build(),
    [ControlSchemeBindingType.Accelerate]: this.accelerateBindingFormBuilder.build(),
    [ControlSchemeBindingType.Power]: this.powerBindingFormBuilder.build(),
  });

  constructor(
    private readonly container: ViewContainerRef,
    private readonly formBuilder: FormBuilder,
    private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
    private readonly speedBindingFormBuilder: SpeedBindingFormBuilderService,
    private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
    private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
    private readonly trainBindingFormBuilder: TrainBindingFormBuilderService,
    private readonly gearboxBindingFormBuilder: GearboxBindingFormBuilderService,
    private readonly accelerateBindingFormBuilder: AccelerateBindingFormBuilderService,
    private readonly powerBindingFormBuilder: PowerBindingFormBuilderService,
    private readonly speedBindingMapper: SpeedBindingFormMapperService,
    private readonly servoBindingMapper: ServoBindingFormMapperService,
    private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
    private readonly stepperBindingMapper: StepperBindingFormMapperService,
    private readonly trainBindingMapper: TrainBindingFormMapperService,
    private readonly gearboxBindingMapper: GearboxBindingFormMapperService,
    private readonly accelerateBindingMapper: AccelerateBindingFormMapperService,
    private readonly powerBindingMapper: PowerBindingFormMapperService,
  ) {
    this.bindingChange = this._form.valueChanges.pipe(
      startWith(null),
      map(() => {
        const form = this._form.controls[this._bindingType];
        return form.valid && form.dirty ? this.mapFormToModel() : null;
      }),
      distinctUntilChanged(),
    );

    this.bindingFormDirtyChange = this._form.valueChanges.pipe(
      startWith(null),
      map(() => this._form.dirty),
      distinctUntilChanged(),
    );
  }

  /**
   * Renders specified binding type
   * @param bindingType
   */
  public setBindingType(bindingType: ControlSchemeBindingType): void {
    this._bindingType = bindingType;
    this.updateRenderer();
  }

  /**
   * Injects binding into form
   * @param binding
   */
  public setBinding(binding: ControlSchemeBinding): void {
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

  private patchForm(patch: ControlSchemeBinding): void {
    if (patch.id !== undefined) {
      this._form.controls.id.setValue(patch.id);
    }
    switch (patch.bindingType) {
      case ControlSchemeBindingType.Speed:
        this.speedBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Speed], patch);
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
      case ControlSchemeBindingType.Train:
        this.trainBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Train], patch);
        break;
      case ControlSchemeBindingType.Gearbox:
        this.gearboxBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Gearbox], patch);
        break;
      case ControlSchemeBindingType.Accelerate:
        this.accelerateBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Accelerate], patch);
        break;
      case ControlSchemeBindingType.Power:
        this.powerBindingFormBuilder.patchForm(this._form.controls[ControlSchemeBindingType.Power], patch);
        break;
      default:
        return patch satisfies never;
    }
  }

  private mapFormToModel(): ControlSchemeBinding {
    const id = this._form.controls.id.value;
    switch (this._bindingType) {
      case ControlSchemeBindingType.Speed:
        return this.speedBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Speed]);
      case ControlSchemeBindingType.Servo:
        return this.servoBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Servo]);
      case ControlSchemeBindingType.SetAngle:
        return this.setAngleBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.SetAngle]);
      case ControlSchemeBindingType.Stepper:
        return this.stepperBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Stepper]);
      case ControlSchemeBindingType.Train:
        return this.trainBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Train]);
      case ControlSchemeBindingType.Gearbox:
        return this.gearboxBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Gearbox]);
      case ControlSchemeBindingType.Accelerate:
        return this.accelerateBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Accelerate]);
      case ControlSchemeBindingType.Power:
        return this.powerBindingMapper.mapToModel(id, this._form.controls[ControlSchemeBindingType.Power]);
      default:
        return this._bindingType satisfies void;
    }
  }
}
