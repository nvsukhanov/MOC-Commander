import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import {
    ControlSchemeInputAction,
    ControlSchemeSetAngleBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    SetAngleTaskPayload
} from '../../../../models';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { isInputActivated } from './is-input-activated';

@Injectable()
export class SetAngleTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.SetAngle> {
    public buildPayload(
        binding: ControlSchemeSetAngleBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
    ): Observable<{ payload: SetAngleTaskPayload; inputTimestamp: number } | null> {
        const setAngleInput = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.SetAngle])];
        const setAngleInputValue = setAngleInput?.value ?? 0;

        if (!isInputActivated(setAngleInputValue)) {
            return of(null);
        }
        const resultingAngle = binding.angle - motorEncoderOffset;

        const payload: SetAngleTaskPayload = {
            bindingType: ControlSchemeBindingType.SetAngle,
            angle: resultingAngle,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return of({ payload, inputTimestamp: setAngleInput?.timestamp ?? Date.now() });
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null> {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
            return of(null);
        }
        return of({
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        });
    }
}