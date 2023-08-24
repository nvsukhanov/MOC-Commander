import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import { AngleShiftTaskPayload, ControlSchemeAngleShiftBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, } from '../../../../models';
import { ITaskPayloadFactory } from './i-task-payload-factory';

@Injectable({ providedIn: 'root' })
export class AngleShiftTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.AngleShift> {
    private readonly inputThreshold = 0.5;

    public buildPayload(
        binding: ControlSchemeAngleShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): Observable<{ payload: AngleShiftTaskPayload; inputTimestamp: number } | null> {
        const isNextAngleInputActive = (inputsState[controllerInputIdFn(binding.inputs.nextAngle)]?.value ?? 0) > this.inputThreshold;
        const isPrevAngleInputActive = !!binding.inputs.prevAngle
            && (inputsState[controllerInputIdFn(binding.inputs.prevAngle)]?.value ?? 0) > this.inputThreshold;

        const sameBindingPrevTaskPayload: AngleShiftTaskPayload | null = previousTask?.bindingId === binding.id
                                                                         ? previousTask.payload as AngleShiftTaskPayload
                                                                         : null;
        const previousLevel = sameBindingPrevTaskPayload?.angleIndex ?? binding.initialStepIndex;
        const isPreviousTaskNextSpeedInputActive = sameBindingPrevTaskPayload?.nextAngleActiveInput ?? false;
        const isPreviousTaskPreviousSpeedInputActive = sameBindingPrevTaskPayload?.nextAngleActiveInput ?? false;

        let nextLevel = previousLevel;
        if (isNextAngleInputActive && !isPreviousTaskNextSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, -1);
        }

        if (isPrevAngleInputActive && !isPreviousTaskPreviousSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, 1);
        }

        const payload: AngleShiftTaskPayload = {
            bindingType: ControlSchemeBindingType.AngleShift,
            angleIndex: nextLevel,
            angle: binding.angles[nextLevel] - motorEncoderOffset,
            speed: binding.speed,
            power: binding.power,
            nextAngleActiveInput: isNextAngleInputActive,
            prevAngleActiveInput: isPrevAngleInputActive,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile,
            endState: binding.endState,
        };
        return of({ payload, inputTimestamp: Date.now() });
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null> {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SpeedShift) {
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

    private calculateUpdatedLevel(
        binding: ControlSchemeAngleShiftBinding,
        previousLevel: number,
        levelIncrement: 1 | -1
    ): number {
        return binding.angles[previousLevel + levelIncrement] !== undefined
               ? previousLevel + levelIncrement
               : previousLevel;
    }
}
