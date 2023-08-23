import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

const REQUIRED_PORT_MODES_FOR_OPERATION_MODE: { [k in ControlSchemeBindingType]: PortModeName[] } = {
    [ControlSchemeBindingType.Linear]: [ PortModeName.speed ],
    [ControlSchemeBindingType.Servo]: [ PortModeName.absolutePosition, PortModeName.position ],
    [ControlSchemeBindingType.SetAngle]: [ PortModeName.absolutePosition, PortModeName.position ],
    [ControlSchemeBindingType.Stepper]: [ PortModeName.position ],
    [ControlSchemeBindingType.SpeedStepper]: [ PortModeName.speed ]
};

export function ioHasMatchingModeForOpMode(
    operationMode: ControlSchemeBindingType,
    ioOutputPortModeNames: PortModeName[],
): boolean {
    return REQUIRED_PORT_MODES_FOR_OPERATION_MODE[operationMode]?.some((requiredPortModeName) =>
        ioOutputPortModeNames.includes(requiredPortModeName)
    ) ?? false;
}
