import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import {
    ControlSchemeInputAction,
    ControlSchemeSetSpeedBinding,
    ControllerInputModel,
    InputGain,
    PortCommandTask,
    PortCommandTaskPayload,
    SetSpeedTaskPayload
} from '../../../../models';
import { controllerInputIdFn } from '../../../../reducers';
import { calcInputGain } from './calc-input-gain';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { snapSpeed } from './snap-speed';

@Injectable()
export class SetSpeedTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.SetSpeed> {
    public buildPayload(
        binding: ControlSchemeSetSpeedBinding,
        inputsState: Dictionary<ControllerInputModel>
    ): { payload: SetSpeedTaskPayload; inputTimestamp: number } | null {
        const accelerateInputModel = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Accelerate])];

        const brakeInputModel = binding.inputs[ControlSchemeInputAction.Brake]
                                ? inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Brake])]
                                : undefined;

        let inputTimestamp = 0;
        if (accelerateInputModel && brakeInputModel) {
            inputTimestamp = Math.max(accelerateInputModel.timestamp, brakeInputModel.timestamp);
        } else if (accelerateInputModel) {
            inputTimestamp = accelerateInputModel.timestamp;
        } else if (brakeInputModel) {
            inputTimestamp = brakeInputModel.timestamp;
        } else {
            return null;
        }

        const speedInput = accelerateInputModel?.value ?? 0;
        const brakeInput = brakeInputModel?.value ?? 0;

        const speed = this.calculateSpeed(
            speedInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[ControlSchemeInputAction.Accelerate].gain
        );

        const payload: SetSpeedTaskPayload = {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: snapSpeed(speed),
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
