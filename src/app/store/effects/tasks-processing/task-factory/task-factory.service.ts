import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import {
    AngleShiftTaskPayloadFactoryService,
    ITaskPayloadFactory,
    ServoTaskPayloadFactoryService,
    SetAngleTaskPayloadFactoryService,
    SetSpeedTaskPayloadFactoryService,
    SpeedShiftTaskPayloadFactoryService,
    StepperTaskPayloadFactoryService
} from './payload-factories';
import { payloadHash } from '../payload-hash';

@Injectable({ providedIn: 'root' })
export class TaskFactoryService {
    private readonly taskPayloadFactories: { [k in ControlSchemeBindingType]: ITaskPayloadFactory<k> } = {
        [ControlSchemeBindingType.Servo]: this.servoTaskPayloadFactory,
        [ControlSchemeBindingType.SetAngle]: this.setAngleTaskPayloadFactory,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedTaskPayloadFactory,
        [ControlSchemeBindingType.SpeedShift]: this.speedShiftTaskPayloadFactory,
        [ControlSchemeBindingType.Stepper]: this.stepperTaskPayloadFactory,
        [ControlSchemeBindingType.AngleShift]: this.angleShiftTaskPayloadFactory,
    };

    constructor(
        private readonly servoTaskPayloadFactory: ServoTaskPayloadFactoryService,
        private readonly setAngleTaskPayloadFactory: SetAngleTaskPayloadFactoryService,
        private readonly setSpeedTaskPayloadFactory: SetSpeedTaskPayloadFactoryService,
        private readonly speedShiftTaskPayloadFactory: SpeedShiftTaskPayloadFactoryService,
        private readonly stepperTaskPayloadFactory: StepperTaskPayloadFactoryService,
        private readonly angleShiftTaskPayloadFactory: AngleShiftTaskPayloadFactoryService
    ) {
    }

    public buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): Observable<PortCommandTask | null> {
        return this.buildPayload(binding, inputsState, motorEncoderOffset, lastExecutedTask).pipe(
            map((payloadBuildResult) => {
                if (payloadBuildResult) {
                    return this.composeTask(binding, payloadBuildResult.payload, payloadBuildResult.inputTimestamp);
                }
                return null;
            })
        );
    }

    public buildCleanupTask(
        previousTask: PortCommandTask
    ): Observable<PortCommandTask | null> {
        return this.buildCleanupPayload(previousTask).pipe(
            map((payload) => {
                if (payload) {
                    return {
                        ...previousTask,
                        payload,
                        hash: this.calculateHash(previousTask.hubId, previousTask.portId, payload)
                    };
                }
                return null;
            })
        );
    }

    private buildPayload<T extends ControlSchemeBindingType>(
        binding: ControlSchemeBinding & { operationMode: T },
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): Observable<{ payload: PortCommandTaskPayload; inputTimestamp: number } | null> {
        const taskPayloadFactory: ITaskPayloadFactory<T> = this.taskPayloadFactories[binding.operationMode];
        return taskPayloadFactory.buildPayload(
            binding,
            inputsState,
            motorEncoderOffset,
            previousTask
        );
    }

    private buildCleanupPayload(
        previousTask: PortCommandTask
    ): Observable<PortCommandTaskPayload | null> {
        return this.taskPayloadFactories[previousTask.payload.bindingType].buildCleanupPayload(previousTask);
    }

    private calculateHash(
        hubId: string,
        portId: number,
        payload: PortCommandTaskPayload
    ): string {
        return `${hubId}/${portId}/${payloadHash(payload)}`;
    }

    private composeTask(
        binding: ControlSchemeBinding,
        payload: PortCommandTaskPayload,
        inputTimestamp: number
    ): PortCommandTask {
        return {
            hubId: binding.hubId,
            portId: binding.portId,
            bindingId: binding.id,
            payload,
            hash: this.calculateHash(binding.hubId, binding.portId, payload),
            inputTimestamp
        };
    }
}
