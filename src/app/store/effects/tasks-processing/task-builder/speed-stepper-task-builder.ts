import { Dictionary } from '@ngrx/entity';
import {
    ControlSchemeBinding,
    ControlSchemeSpeedStepperBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    SpeedStepperTaskPayload,
    controllerInputIdFn
} from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';

export class SpeedStepperTaskBuilder extends BaseTaskBuilder {
    private readonly inputThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): { payload: SpeedStepperTaskPayload; inputTimestamp: number } | null {
        if (binding.operationMode !== ControlSchemeBindingType.SpeedStepper) {
            return null;
        }

        const isNextSpeedInputActive = (inputsState[controllerInputIdFn(binding.inputs.nextSpeed)]?.value ?? 0) > this.inputThreshold;
        const isPrevSpeedInputActive = !!binding.inputs.prevSpeed
            && (inputsState[controllerInputIdFn(binding.inputs.prevSpeed)]?.value ?? 0) > this.inputThreshold;
        const isStopInputActive = !!binding.inputs.stop && (inputsState[controllerInputIdFn(binding.inputs.stop)]?.value ?? 0) > this.inputThreshold;

        if (isStopInputActive) {
            return {
                payload: {
                    bindingType: ControlSchemeBindingType.SpeedStepper,
                    nextSpeedActiveInput: isNextSpeedInputActive,
                    prevSpeedActiveInput: isPrevSpeedInputActive,
                    speed: 0,
                    power: 0,
                    level: binding.initialStepIndex,
                    useAccelerationProfile: binding.useAccelerationProfile,
                    useDecelerationProfile: binding.useDecelerationProfile
                },
                inputTimestamp: Date.now()
            };
        }

        const sameBindingPrevTaskPayload: SpeedStepperTaskPayload | null = previousTask?.bindingId === binding.id
                                                                           ? previousTask.payload as SpeedStepperTaskPayload
                                                                           : null;
        const previousLevel = sameBindingPrevTaskPayload?.level ?? binding.initialStepIndex;
        const isPreviousTaskNextSpeedInputActive = sameBindingPrevTaskPayload?.nextSpeedActiveInput ?? false;
        const isPreviousTaskPreviousSpeedInputActive = sameBindingPrevTaskPayload?.prevSpeedActiveInput ?? false;

        let nextLevel = previousLevel;
        if (isNextSpeedInputActive && !isPreviousTaskNextSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, -1);
        }

        if (isPrevSpeedInputActive && !isPreviousTaskPreviousSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, 1);
        }

        const payload: SpeedStepperTaskPayload = {
            bindingType: ControlSchemeBindingType.SpeedStepper,
            level: nextLevel,
            speed: binding.steps[nextLevel],
            power: binding.power,
            nextSpeedActiveInput: isNextSpeedInputActive,
            prevSpeedActiveInput: isPrevSpeedInputActive,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };
        return { payload, inputTimestamp: Date.now() };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.Linear,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private calculateUpdatedLevel(
        binding: ControlSchemeSpeedStepperBinding,
        previousLevel: number,
        levelIncrement: 1 | -1
    ): number {
        return binding.steps[previousLevel + levelIncrement] !== undefined
               ? previousLevel + levelIncrement
               : previousLevel;
    }
}
