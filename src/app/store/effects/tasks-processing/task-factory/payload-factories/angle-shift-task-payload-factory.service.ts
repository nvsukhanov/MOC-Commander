import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, isInputActivated } from '@app/shared';

import {
    AngleShiftTaskPayload,
    ControlSchemeAngleShiftBinding,
    ControlSchemeInputAction,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload
} from '../../../../models';
import { controllerInputIdFn } from '../../../../reducers';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { calculateNextLoopingIndex } from './calculate-next-looping-index';

@Injectable()
export class AngleShiftTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.AngleShift> {
    public buildPayload(
        binding: ControlSchemeAngleShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): { payload: AngleShiftTaskPayload; inputTimestamp: number } | null {
        const angleShiftPrevTask = previousTask && previousTask.payload.bindingType === ControlSchemeBindingType.AngleShift
                                   ? previousTask as PortCommandTask<ControlSchemeBindingType.AngleShift>
                                   : null;
        return this.buildPayloadUsingPreviousTask(
            binding,
            inputsState,
            motorEncoderOffset,
            angleShiftPrevTask
        );
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.AngleShift) {
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

    private buildPayloadUsingPreviousTask(
        binding: ControlSchemeAngleShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask<ControlSchemeBindingType.AngleShift> | null
    ): { payload: AngleShiftTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.NextLevel);
        const prevLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.PrevLevel);
        const resetLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.Reset);

        if (!nextLevelInput.isActivated && !prevLevelInput.isActivated && !resetLevelInput.isActivated) {
            return null;
        }

        if (resetLevelInput.isActivated) {
            return {
                payload: this.buildResetPayload(binding, motorEncoderOffset),
                inputTimestamp: resetLevelInput.timestamp
            };
        }

        const previousAngleIndexUnguarded = binding.angles.findIndex((angle) => angle === previousTask?.payload.angle);
        // TODO: we can probably find nearest angle instead of just using the initial step index
        const previousAngleIndex = previousAngleIndexUnguarded === -1 ? binding.initialLevelIndex : previousAngleIndexUnguarded;

        const angleChange = (+prevLevelInput.isActivated - +nextLevelInput.isActivated) as -1 | 1 | 0;

        const { nextIndex, isLooping } = calculateNextLoopingIndex(
            binding.angles,
            previousAngleIndex,
            angleChange,
            previousTask?.payload.isLooping ?? false,
            binding.loopingMode
        );

        return {
            payload: {
                bindingType: ControlSchemeBindingType.AngleShift,
                initialLevelIndex: binding.initialLevelIndex,
                angleIndex: nextIndex,
                offset: motorEncoderOffset,
                angle: binding.angles[nextIndex],
                speed: binding.speed,
                power: binding.power,
                isLooping,
                useAccelerationProfile: binding.useAccelerationProfile,
                useDecelerationProfile: binding.useDecelerationProfile,
                endState: binding.endState,
            },
            inputTimestamp: Math.max(nextLevelInput.timestamp, prevLevelInput.timestamp)
        };
    }

    private buildResetPayload(
        binding: ControlSchemeAngleShiftBinding,
        motorEncoderOffset: number
    ): AngleShiftTaskPayload {
        return {
            bindingType: ControlSchemeBindingType.AngleShift,
            initialLevelIndex: binding.initialLevelIndex,
            angleIndex: binding.initialLevelIndex,
            offset: motorEncoderOffset,
            angle: binding.angles[binding.initialLevelIndex],
            speed: binding.speed,
            power: binding.power,
            isLooping: false,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile,
            endState: binding.endState,
        };
    }

    private getActiveInput(
        binding: ControlSchemeAngleShiftBinding,
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
