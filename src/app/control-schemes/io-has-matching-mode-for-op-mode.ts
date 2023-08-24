import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

const REQUIRED_PORT_MODES_FOR_OPERATION_MODE: { [k in ControlSchemeBindingType]: PortModeName[] } = {
    [ControlSchemeBindingType.SetSpeed]: [ PortModeName.speed ],
    [ControlSchemeBindingType.Servo]: [ PortModeName.absolutePosition, PortModeName.position ],
    [ControlSchemeBindingType.SetAngle]: [ PortModeName.absolutePosition, PortModeName.position ],
    [ControlSchemeBindingType.Stepper]: [ PortModeName.position ],
    [ControlSchemeBindingType.SpeedShift]: [ PortModeName.speed ],
    [ControlSchemeBindingType.AngleShift]: [ PortModeName.absolutePosition, PortModeName.position ]
};

export function ioHasMatchingModeForOpMode(
    operationMode: ControlSchemeBindingType,
    ioOutputPortModeNames: PortModeName[],
): boolean {
    const ioOuputPortModeNamesSet = new Set(ioOutputPortModeNames);
    return REQUIRED_PORT_MODES_FOR_OPERATION_MODE[operationMode].every((requiredPortModeName) =>
        ioOuputPortModeNamesSet.has(requiredPortModeName)
    ) ?? false;
}
