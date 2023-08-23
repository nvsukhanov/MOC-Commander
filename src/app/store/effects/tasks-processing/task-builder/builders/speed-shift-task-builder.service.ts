import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import { ControlSchemeSpeedShiftBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, SpeedShiftTaskPayload, } from '../../../../models';
import { BaseTaskBuilder } from '../base-task-builder';

@Injectable({ providedIn: 'root' })
export class SpeedShiftTaskBuilderService extends BaseTaskBuilder<ControlSchemeSpeedShiftBinding, SpeedShiftTaskPayload> {
    private readonly inputThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeSpeedShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): { payload: SpeedShiftTaskPayload; inputTimestamp: number } | null {
        const isNextSpeedInputActive = (inputsState[controllerInputIdFn(binding.inputs.nextSpeed)]?.value ?? 0) > this.inputThreshold;
        const isPrevSpeedInputActive = !!binding.inputs.prevSpeed
            && (inputsState[controllerInputIdFn(binding.inputs.prevSpeed)]?.value ?? 0) > this.inputThreshold;
        const isStopInputActive = !!binding.inputs.stop && (inputsState[controllerInputIdFn(binding.inputs.stop)]?.value ?? 0) > this.inputThreshold;

        if (isStopInputActive) {
            return {
                payload: {
                    bindingType: ControlSchemeBindingType.SpeedShift,
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

        const sameBindingPrevTaskPayload: SpeedShiftTaskPayload | null = previousTask?.bindingId === binding.id
                                                                         ? previousTask.payload as SpeedShiftTaskPayload
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

        const payload: SpeedShiftTaskPayload = {
            bindingType: ControlSchemeBindingType.SpeedShift,
            level: nextLevel,
            speed: binding.levels[nextLevel],
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
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SpeedShift) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private calculateUpdatedLevel(
        binding: ControlSchemeSpeedShiftBinding,
        previousLevel: number,
        levelIncrement: 1 | -1
    ): number {
        return binding.levels[previousLevel + levelIncrement] !== undefined
               ? previousLevel + levelIncrement
               : previousLevel;
    }
}
