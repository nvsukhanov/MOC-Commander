import { ControlSchemeBinding, PortCommandTask } from '../../../models';

export interface IPortCommandTaskBuilder {
    build(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;
}
