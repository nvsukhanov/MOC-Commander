import { PortCommandTask } from '@app/shared';
import { ControlSchemeBinding } from '../../../models';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;
}
