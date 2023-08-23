import { ControlSchemeBindingType, ControllerInputType } from '@app/shared';

const CONTROLLER_TO_IO_OPERATION_MODES: { [k in ControllerInputType]: ReadonlyArray<ControlSchemeBindingType> } = { // TODO: is this really necessary?
    [ControllerInputType.Axis]: [
        ControlSchemeBindingType.Linear,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SpeedShift
    ],
    [ControllerInputType.Button]: [
        ControlSchemeBindingType.Linear,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift
    ],
    [ControllerInputType.Trigger]: [
        ControlSchemeBindingType.Linear,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift
    ],
    [ControllerInputType.ButtonGroup]: [
        ControlSchemeBindingType.Linear,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift
    ],
};

export function getInputTypesForOperationMode(
    operationMode: ControlSchemeBindingType
): ControllerInputType[] {
    const inputTypes = new Set<ControllerInputType>();
    for (const [ inputType, ioOperationModes ] of Object.entries(CONTROLLER_TO_IO_OPERATION_MODES)) {
        if (ioOperationModes.includes(operationMode)) {
            inputTypes.add(inputType as ControllerInputType);
        }
    }
    return [ ...inputTypes ];
}
