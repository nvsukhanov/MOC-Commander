import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeTrainBinding,
    LoopingMode,
    PortCommandTask,
    PortCommandTaskPayload,
    TrainBindingInputAction,
    TrainTaskPayload
} from '@app/store';

import { calculateNextLoopingIndex, isDirectionalInputActivated } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Train> {
    public buildPayload(
        binding: ControlSchemeTrainBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: TrainTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainBindingInputAction.NextSpeed);
        const prevLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainBindingInputAction.PrevSpeed);
        const resetLevelInput = this.getActiveInput(binding, currentInput, previousInput, TrainBindingInputAction.Reset);

        if (resetLevelInput.isActivated) {
            return {
                payload: {
                    bindingType: ControlSchemeBindingType.Train,
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
        const isLoopingPrev = previousTask?.payload.bindingType === ControlSchemeBindingType.Train && binding.loopingMode !== LoopingMode.None
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

        const payload: TrainTaskPayload = {
            bindingType: ControlSchemeBindingType.Train,
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
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Train) {
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
        binding: ControlSchemeTrainBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        inputAction: keyof ControlSchemeTrainBinding['inputs'],
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
