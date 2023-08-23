import { Dictionary } from '@ngrx/entity';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../../../models';

export interface ITaskBuilder {
    buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}
