import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { controllerInputIdFn } from '../../../../reducers';
import {
    AttachedIoPropsModel,
    ControlSchemeInputAction,
    ControlSchemeTrainControlBinding,
    ControllerInputModel,
    LoopingMode,
    PortCommandTask,
    PortCommandTaskPayload,
    TrainControlTaskPayload,
} from '../../../../models';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { calculateNextLoopingIndex } from './calculate-next-looping-index';

@Injectable()
export class TrainControlTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.TrainControl> {
    public buildPayload(
        binding: ControlSchemeTrainControlBinding,
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: TrainControlTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.NextLevel);
        const prevLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.PrevLevel);
        const resetLevelInput = this.getActiveInput(binding, inputsState, ControlSchemeInputAction.Reset);

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

        const expectedAngleChangeDirection = (+prevLevelInput.isActivated - +nextLevelInput.isActivated) as -1 | 1 | 0;

        const { nextIndex, isLooping } = calculateNextLoopingIndex(
            binding.levels,
            previousLevelIndex,
            expectedAngleChangeDirection,
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
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private getActiveInput(
        binding: ControlSchemeTrainControlBinding,
        inputState: Dictionary<ControllerInputModel>,
        inputAction: ControlSchemeInputAction,
    ): { isActivated: boolean; timestamp: number } {
        const bindingInputModel = binding.inputs[inputAction];
        if (bindingInputModel) {
            const input = inputState[controllerInputIdFn(bindingInputModel)];
            if (input) {
                return {
                    isActivated: input.isActivated,
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
