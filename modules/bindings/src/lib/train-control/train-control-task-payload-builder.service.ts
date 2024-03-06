import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeTrainControlBinding,
    LoopingMode,
    PortCommandTask,
    PortCommandTaskPayload,
    TrainControlInputAction,
    TrainControlTaskPayload
} from '@app/store';

import { calculateNextLoopingIndex, isDirectionalInputActivated } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainControlTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.TrainControl> {
    public buildPayload(
        binding: ControlSchemeTrainControlBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: TrainControlTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainControlInputAction.NextSpeed);
        const prevLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainControlInputAction.PrevSpeed);
        const resetLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainControlInputAction.Reset);

        if (resetLevelInput.isActivated) {
            return {
                payload: {
                    bindingType: ControlSchemeBindingType.TrainControl,
                    speed: 0,
                    power: 0,
                    isLooping: false,
                    speedIndex: binding.initialLevelIndex,
                    initialLevelIndex: binding.initialLevelIndex,
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
        const isLoopingPrev = previousTask?.payload.bindingType === ControlSchemeBindingType.TrainControl && binding.loopingMode !== LoopingMode.None
                              ? previousTask.payload.isLooping
                              : false;

        const previousLevelIndexUnguarded = binding.levels.indexOf(prevSpeed);
        const previousLevelIndex = previousLevelIndexUnguarded === -1 ? binding.initialLevelIndex : previousLevelIndexUnguarded;

        const expectedLevelChange = (+prevLevelInput.isActivated - +nextLevelInput.isActivated) as -1 | 1 | 0;

        const { nextIndex, isLooping } = calculateNextLoopingIndex(
            binding.levels,
            previousLevelIndex,
            expectedLevelChange,
            isLoopingPrev,
            binding.loopingMode
        );

        const payload: TrainControlTaskPayload = {
            bindingType: ControlSchemeBindingType.TrainControl,
            speedIndex: nextIndex,
            speed: binding.levels[nextIndex],
            power: binding.levels[nextIndex] === 0 ? 0 : binding.power,
            initialLevelIndex: binding.initialLevelIndex,
            isLooping: isLooping,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };
        return { payload, inputTimestamp: Math.max(nextLevelInput.timestamp, prevLevelInput.timestamp) };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.TrainControl) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.Speed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private getActiveInput(
        binding: ControlSchemeTrainControlBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        inputAction: keyof ControlSchemeTrainControlBinding['inputs'],
    ): { isActivated: boolean; timestamp: number } {
        const currentInputForAction = currentInput[inputAction];
        const inputConfig = binding.inputs[inputAction];
        if (currentInputForAction && inputConfig) {
            const isNextActivated = isDirectionalInputActivated(
                inputConfig.inputDirection,
                inputAction,
                currentInput
            );
            const isPrevActivated = isDirectionalInputActivated(
                inputConfig.inputDirection,
                inputAction,
                previousInput
            );

            return {
                isActivated: isNextActivated && !isPrevActivated,
                timestamp: currentInputForAction.timestamp,
            };
        }
        return {
            isActivated: false,
            timestamp: -Infinity,
        };
    }
}
