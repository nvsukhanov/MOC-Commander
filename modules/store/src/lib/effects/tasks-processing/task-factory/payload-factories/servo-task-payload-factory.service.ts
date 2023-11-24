import { MotorServoEndState } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, getTranslationArcs } from '@app/shared-misc';

import {
    AttachedIoPropsModel,
    ControlSchemeInputAction,
    ControlSchemeServoBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    ServoTaskPayload
} from '../../../../models';
import { controllerInputIdFn } from '../../../../reducers';
import { calcInputGain } from './calc-input-gain';
import { ITaskPayloadFactory } from './i-task-payload-factory';

@Injectable()
export class ServoTaskPayloadFactoryService implements ITaskPayloadFactory<ControlSchemeBindingType.Servo> {
    private readonly snappingThreshold = 10;

    public buildPayload(
        binding: ControlSchemeServoBinding,
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): { payload: ServoTaskPayload; inputTimestamp: number } | null {
        const servoInput = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Servo])];
        if (!servoInput) {
            return null;
        }
        const servoInputValue = calcInputGain(servoInput?.value ?? 0, binding.inputs[ControlSchemeInputAction.Servo].gain);

        const translationPaths = getTranslationArcs(
            ioProps?.motorEncoderOffset ?? 0,
            this.getArcCenter(binding, ioProps)
        );
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = this.getArcSize(binding, ioProps);
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
        return { payload, inputTimestamp: servoInput.timestamp };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Servo) {
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

    private getArcSize(
        binding: ControlSchemeServoBinding,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): number {
        if (binding.calibrateOnStart) {
            const range = ioProps?.startupServoCalibrationData?.range;
            if (range === undefined) {
                throw new Error('Servo range is not defined');
            }
            return range;
        }
        return binding.range;
    }

    private getArcCenter(
        binding: ControlSchemeServoBinding,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): number {
        if (binding.calibrateOnStart) {
            const center = ioProps?.startupServoCalibrationData?.aposCenter;
            if (center === undefined) {
                throw new Error('Servo center is not defined');
            }
            return center;
        }
        return binding.aposCenter;
    }
}
