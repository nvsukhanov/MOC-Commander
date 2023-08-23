import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../../../models';
import { ITaskBuilder } from './i-task-builder';
import {
    ServoTaskBuilderService,
    SetAngleTaskBuilderService,
    SetSpeedTaskBuilderService,
    SpeedShiftTaskBuilderService,
    StepperTaskBuilderService
} from './builders';

@Injectable({ providedIn: 'root' })
export class TaskBuilderService implements ITaskBuilder {
    private readonly taskBuildersMap: { [k in ControlSchemeBindingType]: ITaskBuilder } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskBuilder,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskBuilder,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskBuilder,
        [ControlSchemeBindingType.SpeedShift]: this.speedShiftTaskBuilder,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskBuilder,
    };

    constructor(
        private readonly servoTaskBuilder: ServoTaskBuilderService,
        private readonly setAngleTaskBuilder: SetAngleTaskBuilderService,
        private readonly setSpeedTaskBuilder: SetSpeedTaskBuilderService,
        private readonly speedShiftTaskBuilder: SpeedShiftTaskBuilderService,
        private readonly stepperTaskBuilder: StepperTaskBuilderService,
    ) {
    }

    public buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null {
        return this.taskBuildersMap[binding.operationMode].buildTask(binding, inputsState, motorEncoderOffset, previousTask);
    }

    public buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null {
        return this.taskBuildersMap[previousTask.payload.bindingType].buildCleanupTask(previousTask);
    }

}
