import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import {
    ControlSchemeInputAction,
    ControlSchemeSpeedShiftBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    SpeedShiftTaskPayload,
} from '../../../../models';
import { ITaskPayloadFactory } from './i-task-payload-factory';
import { isInputActivated } from './is-input-activated';

@Injectable()
export class SpeedShiftTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.SpeedShift> {
    public buildPayload(
        binding: ControlSchemeSpeedShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): Observable<{ payload: SpeedShiftTaskPayload; inputTimestamp: number } | null> {
        const nextSpeedInputValue = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.NextLevel])]?.value ?? 0;
        const isNextSpeedInputActive = isInputActivated(nextSpeedInputValue);
        const prevSpeedInputValue = !!binding.inputs[ControlSchemeInputAction.PrevLevel]
            && inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.PrevLevel])]?.value || 0;
        const isPrevSpeedInputActive = isInputActivated(prevSpeedInputValue);
        const stopInputValue = !!binding.inputs[ControlSchemeInputAction.Reset]
            && inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Reset])]?.value || 0;
        const isStopInputActive = isInputActivated(stopInputValue);

        if (isStopInputActive) {
            return of({
                payload: {
                    bindingType: ControlSchemeBindingType.SpeedShift,
                    nextSpeedActiveInput: isNextSpeedInputActive,
                    prevSpeedActiveInput: isPrevSpeedInputActive,
                    speed: 0,
                    power: 0,
                    speedIndex: binding.initialStepIndex,
                    useAccelerationProfile: binding.useAccelerationProfile,
                    useDecelerationProfile: binding.useDecelerationProfile
                },
                inputTimestamp: Date.now()
            });
        }

        const sameBindingPrevTaskPayload: SpeedShiftTaskPayload | null = previousTask?.bindingId === binding.id
                                                                         ? previousTask.payload as SpeedShiftTaskPayload
                                                                         : null;
        const previousLevel = sameBindingPrevTaskPayload?.speedIndex ?? binding.initialStepIndex;
        const isPreviousTaskNextSpeedInputActive = sameBindingPrevTaskPayload?.nextSpeedActiveInput ?? false;
        const isPreviousTaskPreviousSpeedInputActive = sameBindingPrevTaskPayload?.prevSpeedActiveInput ?? false;

        let nextLevel = previousLevel;
        if (isNextSpeedInputActive && !isPreviousTaskNextSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, -1);
        }

        if (isPrevSpeedInputActive && !isPreviousTaskPreviousSpeedInputActive) {
            nextLevel = this.calculateUpdatedLevel(binding, previousLevel, 1);
        }

        const payload: SpeedShiftTaskPayload = {
            bindingType: ControlSchemeBindingType.SpeedShift,
            speedIndex: nextLevel,
            speed: binding.levels[nextLevel],
            power: binding.power,
            nextSpeedActiveInput: isNextSpeedInputActive,
            prevSpeedActiveInput: isPrevSpeedInputActive,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
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
        binding: ControlSchemeSpeedShiftBinding,
        previousLevel: number,
        levelIncrement: 1 | -1
    ): number {
        return binding.levels[previousLevel + levelIncrement] !== undefined
               ? previousLevel + levelIncrement
               : previousLevel;
    }
}
