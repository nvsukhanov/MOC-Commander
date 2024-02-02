import { Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IBindingDetailsEditFormRenderer, IBindingDetailsEditFormRendererFactory } from '@app/shared-control-schemes';

import { ServoBindingFormBuilderService, ServoBindingFormMapperService } from './servo';
import { SetSpeedBindingFormBuilderService, SetSpeedBindingFormMapperService } from './set-speed';
import { SetAngleBindingFormBuilderService, SetAngleBindingFormMapperService } from './set-angle';
import { StepperBindingFormBuilderService, StepperBindingFormMapperService } from './stepper';
import { TrainControlBindingFormBuilderService, TrainControlBindingFormMapperService } from './train-control';
import { GearboxControlBindingFormBuilderService, GearboxControlBindingFormMapperService } from './gearbox';
import { BindingDetailsEditFormRenderer } from './binding-details-edit-form-renderer';

@Injectable()
export class BindingDetailsEditFormRendererFactoryService implements IBindingDetailsEditFormRendererFactory {
    constructor(
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
    }

    public create(
        container: ViewContainerRef
    ): IBindingDetailsEditFormRenderer {
        return new BindingDetailsEditFormRenderer(
            container,
            this.formBuilder,
            this.servoBindingFormBuilder,
            this.setSpeedBindingFormBuilder,
            this.setAngleBindingFormBuilder,
            this.stepperBindingFormBuilder,
            this.trainControlBindingFormBuilder,
            this.gearboxControlBindingFormBuilder,
            this.setSpeedBindingMapper,
            this.servoBindingMapper,
            this.setAngleBindingMapper,
            this.stepperBindingMapper,
            this.trainControlBindingMapper,
            this.gearboxControlBindingMapper
        );
    }
}