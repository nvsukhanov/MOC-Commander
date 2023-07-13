import { ControllerInputType, HubIoOperationMode } from '@app/shared';

const CONTROLLER_TO_IO_OPERATION_MODES: { [k in ControllerInputType]?: ReadonlyArray<HubIoOperationMode> } = {
    [ControllerInputType.Axis]: [ HubIoOperationMode.Linear, HubIoOperationMode.Servo ],
    [ControllerInputType.Button]: [ HubIoOperationMode.Linear, HubIoOperationMode.Servo, HubIoOperationMode.SetAngle, HubIoOperationMode.Stepper ],
    [ControllerInputType.Trigger]: [ HubIoOperationMode.Linear, HubIoOperationMode.Servo, HubIoOperationMode.SetAngle, HubIoOperationMode.Stepper ],
};

export function getIoOperationModesForControllerInputType(
    inputType: ControllerInputType,
): HubIoOperationMode[] {
    return [ ...CONTROLLER_TO_IO_OPERATION_MODES[inputType] || [] ];
}
