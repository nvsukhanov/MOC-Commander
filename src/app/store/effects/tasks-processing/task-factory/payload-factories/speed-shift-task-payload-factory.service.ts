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
import { calculateNextLoopingIndex } from './calculate-next-looping-index';

@Injectable()
export class SpeedShiftTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.SpeedShift> {
    public buildPayload(
        binding: ControlSchemeSpeedShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): Observable<{ payload: SpeedShiftTaskPayload; inputTimestamp: number } | null> {
        const { isNextSpeedInputActive, isPrevSpeedInputActive, isStopInputActive } = this.calculateActiveInputs(binding, inputsState);

        if (isStopInputActive) {
            return of({
                payload: {
                    bindingType: ControlSchemeBindingType.SpeedShift,
                    nextSpeedActiveInput: isNextSpeedInputActive,
                    prevSpeedActiveInput: isPrevSpeedInputActive,
                    speed: 0,
                    power: 0,
                    isLooping: false,
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
        const isLooping = sameBindingPrevTaskPayload?.isLooping ?? false;
        const isPreviousTaskNextSpeedInputActive = sameBindingPrevTaskPayload?.nextSpeedActiveInput ?? false;
        const isPreviousTaskPreviousSpeedInputActive = sameBindingPrevTaskPayload?.prevSpeedActiveInput ?? false;

        let expectedAngleChangeDirection: -1 | 1 | 0 = 0;
        let nextLevel = previousLevel;
        let isLoopingNext = isLooping;
        if (isNextSpeedInputActive && !isPreviousTaskNextSpeedInputActive) {
            expectedAngleChangeDirection = isLooping ? 1 : -1;
        }

        if (isPrevSpeedInputActive && !isPreviousTaskPreviousSpeedInputActive) {
            expectedAngleChangeDirection = isLooping ? -1 : 1;
        }

        if (expectedAngleChangeDirection !== 0) {
            const nextLevelResult = calculateNextLoopingIndex(
                binding.levels,
                previousLevel,
                expectedAngleChangeDirection,
                isLooping,
                binding.loopingMode
            );
            nextLevel = nextLevelResult.nextIndex;
            isLoopingNext = nextLevelResult.isLooping;
        }

        const payload: SpeedShiftTaskPayload = {
            bindingType: ControlSchemeBindingType.SpeedShift,
            speedIndex: nextLevel,
            speed: binding.levels[nextLevel],
            power: binding.power,
            isLooping: isLoopingNext,
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
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        });
    }

    private calculateActiveInputs(
        binding: ControlSchemeSpeedShiftBinding,
        inputsState: Dictionary<ControllerInputModel>,
    ): { isNextSpeedInputActive: boolean; isPrevSpeedInputActive: boolean; isStopInputActive: boolean } {
        const nextSpeedInputValue = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.NextLevel])]?.value ?? 0;
        const isNextSpeedInputActive = isInputActivated(nextSpeedInputValue);
        const prevSpeedInputValue = !!binding.inputs[ControlSchemeInputAction.PrevLevel]
            && inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.PrevLevel])]?.value || 0;
        const isPrevSpeedInputActive = isInputActivated(prevSpeedInputValue);
        const stopInputValue = !!binding.inputs[ControlSchemeInputAction.Reset]
            && inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Reset])]?.value || 0;
        const isStopInputActive = isInputActivated(stopInputValue);
        return { isNextSpeedInputActive, isPrevSpeedInputActive, isStopInputActive };
    }
}
