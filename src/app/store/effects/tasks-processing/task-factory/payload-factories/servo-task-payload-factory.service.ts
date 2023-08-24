import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingType, getTranslationArcs } from '@app/shared';

import { ControlSchemeServoBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, ServoTaskPayload } from '../../../../models';
import { controllerInputIdFn } from '../../../../reducers';
import { calcInputGain } from './calc-input-gain';
import { ITaskPayloadFactory } from './i-task-payload-factory';

@Injectable({ providedIn: 'root' })
export class ServoTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.Servo> {
    private readonly snappingThreshold = 10;

    public buildPayload(
        binding: ControlSchemeServoBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
    ): Observable<{ payload: ServoTaskPayload; inputTimestamp: number }> {
        const servoInput = inputsState[controllerInputIdFn(binding.inputs.servo)];
        const servoInputValue = calcInputGain(servoInput?.value ?? 0, binding.inputs.servo.gain);

        const translationPaths = getTranslationArcs(motorEncoderOffset, binding.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = binding.range;
        const arcPosition = servoInputValue * arcSize / 2 * (binding.invert ? -1 : 1);

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        const payload: ServoTaskPayload = {
            bindingType: ControlSchemeBindingType.Servo,
            angle: Math.round(snappedAngle),
            speed: Math.round(binding.speed),
            power: binding.power,
            endState: MotorServoEndState.hold,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile,
        };
        return of({ payload, inputTimestamp: servoInput?.timestamp ?? Date.now() });
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null> {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Servo) {
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

    private snapAngle(
        targetAngle: number,
        arcCenter: number,
        maxAngle: number,
        minAngle: number
    ): number {
        const snappedToZeroAngle = Math.abs(targetAngle - arcCenter) < this.snappingThreshold ? arcCenter : targetAngle;
        const snappedToMaxAngle = Math.abs(snappedToZeroAngle - maxAngle) < this.snappingThreshold ? maxAngle : snappedToZeroAngle;
        return Math.abs(snappedToMaxAngle - minAngle) < this.snappingThreshold ? minAngle : snappedToMaxAngle;
    }
}
