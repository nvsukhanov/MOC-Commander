import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, clampSpeed } from '@app/shared-misc';
import {
    ControlSchemeSpeedBinding,
    InputDirection,
    InputGain,
    PortCommandTask,
    PortCommandTaskPayload,
    SpeedBindingInputAction,
    SpeedTaskPayload
} from '@app/store';

import { calcInputGain, extractDirectionAwareInputValue, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class SpeedBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Speed> {
    public buildPayload(
        binding: ControlSchemeSpeedBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Speed>,
    ): { payload: SpeedTaskPayload; inputTimestamp: number } | null {
        const forwardsInputModel = currentInput[SpeedBindingInputAction.Forwards];
        const backwardsInputModel = currentInput[SpeedBindingInputAction.Backwards];
        const brakeInputModel = currentInput[SpeedBindingInputAction.Brake];

        let inputTimestamp = 0;
        if (forwardsInputModel || brakeInputModel || backwardsInputModel) {
            inputTimestamp = Math.max(
                forwardsInputModel?.timestamp ?? 0,
                backwardsInputModel?.timestamp ?? 0,
                brakeInputModel?.timestamp ?? 0,
            );
        } else {
            return null;
        }

        const forwardsInputValue = forwardsInputModel?.value ?? 0;
        const forwardsInputDirection = binding.inputs[SpeedBindingInputAction.Forwards]?.inputDirection ?? InputDirection.Positive;

        const backwardsInputValue = backwardsInputModel?.value ?? 0;
        const backwardsInputDirection = binding.inputs[SpeedBindingInputAction.Backwards]?.inputDirection ?? InputDirection.Positive;

        const brakeInputValue = brakeInputModel?.value ?? 0;
        const brakeInputDirection = binding.inputs[SpeedBindingInputAction.Brake]?.inputDirection ?? InputDirection.Positive;

        const forwardsInput = extractDirectionAwareInputValue(forwardsInputValue, forwardsInputDirection);
        const backwardsInput = extractDirectionAwareInputValue(backwardsInputValue, backwardsInputDirection);
        const brakeInput = extractDirectionAwareInputValue(brakeInputValue, brakeInputDirection);

        const forwardsSpeed = this.calculateSpeed(
            forwardsInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[SpeedBindingInputAction.Forwards]?.gain ?? InputGain.Linear
        );

        const backwardsSpeed = this.calculateSpeed(
            backwardsInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[SpeedBindingInputAction.Backwards]?.gain ?? InputGain.Linear
        );

        const brakeInputWithGain = calcInputGain(brakeInput, binding.inputs[SpeedBindingInputAction.Brake]?.gain ?? InputGain.Linear);

        const payload: SpeedTaskPayload = {
            bindingType: ControlSchemeBindingType.Speed,
            speed: snapSpeed(clampSpeed(Math.abs(forwardsSpeed) - Math.abs(backwardsSpeed))),
            brakeFactor: Math.round(Math.abs(brakeInputWithGain) * binding.maxSpeed),
            power: binding.power,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return { payload, inputTimestamp };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Speed) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.Speed,
            speed: 0,
            brakeFactor: 0,
            power: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private calculateSpeed(
        accelerateInput: number,
        maxAbsSpeed: number,
        invert: boolean,
        inputGain: InputGain
    ): number {
        if (accelerateInput === 0) {
            return 0;
        }
        return calcInputGain(accelerateInput, inputGain) * maxAbsSpeed * (invert ? -1 : 1);
    }
}
