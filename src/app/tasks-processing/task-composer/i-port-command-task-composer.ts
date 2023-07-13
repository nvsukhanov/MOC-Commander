import { ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '@app/shared';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;
}
