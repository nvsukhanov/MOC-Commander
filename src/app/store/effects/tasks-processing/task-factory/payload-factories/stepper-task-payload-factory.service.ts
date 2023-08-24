import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeStepperBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, StepperTaskPayload } from '../../../../models';
import { controllerInputIdFn } from '../../../../reducers';
import { ITaskPayloadFactory } from './i-task-payload-factory';

@Injectable({ providedIn: 'root' })
export class StepperTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.Stepper> {
    public buildPayload(
        binding: ControlSchemeStepperBinding,
        inputsState: Dictionary<ControllerInputModel>,
    ): Observable<{ payload: StepperTaskPayload; inputTimestamp: number } | null> {
        const stepInput = inputsState[controllerInputIdFn(binding.inputs.step)];
        const stepInputValue = stepInput?.value ?? 0;

        if (stepInputValue < 0.5) { // TODO: inject threshold
            return of(null);
        }

        const payload: StepperTaskPayload = {
            bindingType: ControlSchemeBindingType.Stepper,
            degree: binding.degree,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return of({ payload, inputTimestamp: stepInput?.timestamp ?? Date.now() });
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null> {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Stepper) {
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
