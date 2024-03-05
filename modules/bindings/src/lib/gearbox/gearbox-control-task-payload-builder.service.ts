import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeGearboxControlBinding,
    GearboxControlInputAction,
    GearboxControlTaskPayload,
    PortCommandTask,
    PortCommandTaskPayload
} from '@app/store';

import { calculateNextLoopingIndex, isDirectionalInputActivated } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class GearboxControlTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.GearboxControl> {
    public buildPayload(
        binding: ControlSchemeGearboxControlBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTask: PortCommandTask | null
    ): { payload: GearboxControlTaskPayload; inputTimestamp: number } | null {
        const gearboxControlPrevTask = previousTask && previousTask.payload.bindingType === ControlSchemeBindingType.GearboxControl
                                       ? previousTask as PortCommandTask<ControlSchemeBindingType.GearboxControl>
                                       : null;
        return this.buildPayloadUsingPreviousTask(
            binding,
            currentInput,
            previousInput,
            ioProps?.motorEncoderOffset ?? 0,
            gearboxControlPrevTask
        );
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.GearboxControl) {
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
        binding: ControlSchemeGearboxControlBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask<ControlSchemeBindingType.GearboxControl> | null
    ): { payload: GearboxControlTaskPayload; inputTimestamp: number } | null {
        const nextLevelInput = this.getActiveInput(binding, currentInput, previousInput, GearboxControlInputAction.NextGear);
        const prevLevelInput = this.getActiveInput(binding, currentInput, previousInput, GearboxControlInputAction.PrevGear);
        const resetLevelInput = this.getActiveInput(binding, currentInput, previousInput, GearboxControlInputAction.Reset);

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
                bindingType: ControlSchemeBindingType.GearboxControl,
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
        binding: ControlSchemeGearboxControlBinding,
        motorEncoderOffset: number
    ): GearboxControlTaskPayload {
        return {
            bindingType: ControlSchemeBindingType.GearboxControl,
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
        binding: ControlSchemeGearboxControlBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        inputAction: keyof ControlSchemeGearboxControlBinding['inputs'],
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
