import { Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IBindingDetailsEditFormRenderer, IBindingDetailsEditFormRendererFactory } from '@app/shared-control-schemes';

import { ServoBindingFormBuilderService, ServoBindingFormMapperService } from './servo';
import { SpeedBindingFormBuilderService, SpeedBindingFormMapperService } from './speed';
import { SetAngleBindingFormBuilderService, SetAngleBindingFormMapperService } from './set-angle';
import { StepperBindingFormBuilderService, StepperBindingFormMapperService } from './stepper';
import { TrainBindingFormBuilderService, TrainBindingFormMapperService } from './train';
import { GearboxBindingFormBuilderService, GearboxBindingFormMapperService } from './gearbox';
import { BindingDetailsEditFormRenderer } from './binding-details-edit-form-renderer';
import { AccelerateBindingFormBuilderService, AccelerateBindingFormMapperService } from './accelerate';

@Injectable()
export class BindingDetailsEditFormRendererFactoryService implements IBindingDetailsEditFormRendererFactory {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
    private readonly speedBindingFormBuilder: SpeedBindingFormBuilderService,
    private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
    private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
    private readonly trainBindingFormBuilder: TrainBindingFormBuilderService,
    private readonly gearboxBindingFormBuilder: GearboxBindingFormBuilderService,
    private readonly accelerateBindingFormBuilder: AccelerateBindingFormBuilderService,
    private readonly speedBindingMapper: SpeedBindingFormMapperService,
    private readonly servoBindingMapper: ServoBindingFormMapperService,
    private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
    private readonly stepperBindingMapper: StepperBindingFormMapperService,
    private readonly trainBindingMapper: TrainBindingFormMapperService,
    private readonly gearboxBindingMapper: GearboxBindingFormMapperService,
    private readonly accelerateBindingMapper: AccelerateBindingFormMapperService,
  ) {}

  public create(container: ViewContainerRef): IBindingDetailsEditFormRenderer {
    // oof, this is a lot of dependencies. TODO: refactor this to use a factory pattern
    return new BindingDetailsEditFormRenderer(
      container,
      this.formBuilder,
      this.servoBindingFormBuilder,
      this.speedBindingFormBuilder,
      this.setAngleBindingFormBuilder,
      this.stepperBindingFormBuilder,
      this.trainBindingFormBuilder,
      this.gearboxBindingFormBuilder,
      this.accelerateBindingFormBuilder,
      this.speedBindingMapper,
      this.servoBindingMapper,
      this.setAngleBindingMapper,
      this.stepperBindingMapper,
      this.trainBindingMapper,
      this.gearboxBindingMapper,
      this.accelerateBindingMapper,
    );
  }
}
