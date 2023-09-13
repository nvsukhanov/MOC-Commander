import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import {
    ControlSchemeInputAction,
    ControlSchemeSpeedShiftBinding,
    ControllerInputModel,
    LoopingMode,
    PortCommandTask,
    PortCommandTaskPayload,
    SpeedShiftTaskPayload,
} from '../../../../models';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { isInputActivated } from './is-input-activated';
import { calculateNextLoopingIndex } from './calculate-next-looping-index';

@Injectable()
export class SpeedShiftTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.SpeedShift> {
    public buildPayload(
        binding: ControlSchemeSpeedShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): { payload: SpeedShiftTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.NextLevel);
        const prevLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.PrevLevel);
        const resetLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.Reset);

        if (resetLevelInput.isActivated) {
            return {
                payload: {
                    bindingType: ControlSchemeBindingType.SpeedShift,
                    speed: 0,
                    power: 0,
                    isLooping: false,
                    speedIndex: binding.initialStepIndex,
                    useAccelerationProfile: binding.useAccelerationProfile,
                    useDecelerationProfile: binding.useDecelerationProfile
                },
                inputTimestamp: Date.now()
            };
        }

        if (!nextLevelInput.isActivated && !prevLevelInput.isActivated) {
            return null;
        }
        const prevSpeed = previousTask?.payload.speed ?? 0;
        const isLoopingPrev = previousTask?.payload.bindingType === ControlSchemeBindingType.SpeedShift && binding.loopingMode !== LoopingMode.None
                              ? previousTask.payload.isLooping
                              : false;

        const previousLevelIndexUnguarded = binding.levels.indexOf(prevSpeed);
        const previousLevelIndex = previousLevelIndexUnguarded === -1 ? binding.initialStepIndex : previousLevelIndexUnguarded;

        const expectedAngleChangeDirection = (+prevLevelInput.isActivated - +nextLevelInput.isActivated) as -1 | 1 | 0;

        const { nextIndex, isLooping } = calculateNextLoopingIndex(
            binding.levels,
            previousLevelIndex,
            expectedAngleChangeDirection,
            isLoopingPrev,
            binding.loopingMode
        );

        const payload: SpeedShiftTaskPayload = {
            bindingType: ControlSchemeBindingType.SpeedShift,
            speedIndex: nextIndex,
            speed: binding.levels[nextIndex],
            power: binding.levels[nextIndex] === 0 ? 0 : binding.power,
            isLooping: isLooping,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };
        return { payload, inputTimestamp: Math.max(nextLevelInput.timestamp, prevLevelInput.timestamp) };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SpeedShift) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private getActiveInput(
        binding: ControlSchemeSpeedShiftBinding,
        inputState: Dictionary<ControllerInputModel>,
        inputAction: ControlSchemeInputAction,
    ): { isActivated: boolean; timestamp: number } {
        const bindingInputModel = binding.inputs[inputAction];
        if (bindingInputModel) {
            const input = inputState[controllerInputIdFn(bindingInputModel)];
            if (input) {
                return {
                    isActivated: isInputActivated(input.value),
                    timestamp: input.timestamp,
                };
            }
        }
        return {
            isActivated: false,
            timestamp: -Infinity,
        };
    }
}
