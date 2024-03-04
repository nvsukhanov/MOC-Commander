import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, clampSpeed } from '@app/shared-misc';
import {
    ControlSchemeInputAction,
    ControlSchemeSetSpeedBinding,
    InputDirection,
    InputGain,
    PortCommandTask,
    PortCommandTaskPayload,
    SetSpeedTaskPayload
} from '@app/store';

import { calcInputGain, extractDirectionAwareInputValue, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class SetSpeedTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.SetSpeed> {
    public buildPayload(
        binding: ControlSchemeSetSpeedBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>,
    ): { payload: SetSpeedTaskPayload; inputTimestamp: number } | null {
        const forwardsInputModel = currentInput[ControlSchemeInputAction.Forwards];
        const backwardsInputModel = currentInput[ControlSchemeInputAction.Backwards];
        const brakeInputModel = currentInput[ControlSchemeInputAction.Brake];

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
        const forwardsInputDirection = binding.inputs[ControlSchemeInputAction.Forwards]?.inputDirection ?? InputDirection.Positive;

        const backwardsInputValue = backwardsInputModel?.value ?? 0;
        const backwardsInputDirection = binding.inputs[ControlSchemeInputAction.Backwards]?.inputDirection ?? InputDirection.Positive;

        const brakeInputValue = brakeInputModel?.value ?? 0;
        const brakeInputDirection = binding.inputs[ControlSchemeInputAction.Brake]?.inputDirection ?? InputDirection.Positive;

        const forwardsInput = extractDirectionAwareInputValue(forwardsInputValue, forwardsInputDirection);
        const backwardsInput = extractDirectionAwareInputValue(backwardsInputValue, backwardsInputDirection);
        const brakeInput = extractDirectionAwareInputValue(brakeInputValue, brakeInputDirection);

        const forwardsSpeed = this.calculateSpeed(
            forwardsInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[ControlSchemeInputAction.Forwards]?.gain ?? InputGain.Linear
        );

        const backwardsSpeed = this.calculateSpeed(
            backwardsInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[ControlSchemeInputAction.Backwards]?.gain ?? InputGain.Linear
        );

        const payload: SetSpeedTaskPayload = {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: snapSpeed(clampSpeed(Math.abs(forwardsSpeed) - Math.abs(backwardsSpeed))),
            brakeFactor: Math.round(Math.abs(brakeInput) * binding.maxSpeed),
            power: binding.power,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return { payload, inputTimestamp };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetSpeed) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.SetSpeed,
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
