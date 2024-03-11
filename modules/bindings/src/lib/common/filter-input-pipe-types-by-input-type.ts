import { ControllerInputType } from '@app/controller-profiles';
import { InputPipeType } from '@app/store';

export function filterInputPipeTypesByInputType(
    inputType: ControllerInputType,
    inputPipeTypes: ReadonlyArray<InputPipeType>
): InputPipeType[] {
    return inputPipeTypes.filter((pipe) => {
        switch (pipe) {
            case InputPipeType.Gain:
                return inputType === ControllerInputType.Axis || inputType === ControllerInputType.Trigger;
        }
    });
}
