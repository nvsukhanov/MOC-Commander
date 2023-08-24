import { ControlSchemeBindingType, ControllerInputType } from '@app/shared';

const CONTROLLER_TO_IO_OPERATION_MODES: { [k in ControllerInputType]: ReadonlyArray<ControlSchemeBindingType> } = { // TODO: is this really necessary?
    [ControllerInputType.Axis]: [
        ControlSchemeBindingType.SetSpeed,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SpeedShift,
        ControlSchemeBindingType.AngleShift
    ],
    [ControllerInputType.Button]: [
        ControlSchemeBindingType.SetSpeed,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift,
        ControlSchemeBindingType.AngleShift
    ],
    [ControllerInputType.Trigger]: [
        ControlSchemeBindingType.SetSpeed,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift,
        ControlSchemeBindingType.AngleShift
    ],
    [ControllerInputType.ButtonGroup]: [
        ControlSchemeBindingType.SetSpeed,
        ControlSchemeBindingType.Servo,
        ControlSchemeBindingType.SetAngle,
        ControlSchemeBindingType.Stepper,
        ControlSchemeBindingType.SpeedShift,
        ControlSchemeBindingType.AngleShift
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
