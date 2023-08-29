import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

const REQUIRED_PORT_MODES_FOR_OPERATION_MODE: { [k in ControlSchemeBindingType]: PortModeName[] } = {
    [ControlSchemeBindingType.SetSpeed]: [ PortModeName.speed, PortModeName.power ],
    [ControlSchemeBindingType.Servo]: [ PortModeName.absolutePosition, PortModeName.position, PortModeName.speed, PortModeName.power ],
    [ControlSchemeBindingType.SetAngle]: [ PortModeName.absolutePosition, PortModeName.position, PortModeName.speed, PortModeName.power ],
    [ControlSchemeBindingType.Stepper]: [ PortModeName.position, PortModeName.speed, PortModeName.power ],
    [ControlSchemeBindingType.SpeedShift]: [ PortModeName.speed, PortModeName.power ],
    [ControlSchemeBindingType.AngleShift]: [ PortModeName.absolutePosition, PortModeName.position, PortModeName.speed, PortModeName.power ]
};

export function getMatchingBindingTypes(
    portModeNames: PortModeName[]
): ControlSchemeBindingType[] {
    const portModeNamesSet = new Set(portModeNames);
    const result: ControlSchemeBindingType[] = [];
    for (const [ operationMode, requiredPortModeNames ] of Object.entries(REQUIRED_PORT_MODES_FOR_OPERATION_MODE)) {
        if (requiredPortModeNames.every((requiredPortModeName) => portModeNamesSet.has(requiredPortModeName))) {
            result.push(operationMode as ControlSchemeBindingType);
        }
    }
    return result;
}

export function getAvailableOperationModesForIoOutputPortModeNames(
    portModeNames: PortModeName[]
): ControlSchemeBindingType[] {
    const resultSet = new Set<ControlSchemeBindingType>();
    for (const [ operationMode, requiredPortModeNames ] of Object.entries(REQUIRED_PORT_MODES_FOR_OPERATION_MODE)) {
        if (requiredPortModeNames.every((requiredPortModeName) => portModeNames.includes(requiredPortModeName))) {
            resultSet.add(operationMode as ControlSchemeBindingType);
        }
    }
    return Array.from(resultSet);
}

export function ioHasMatchingModeForOpMode(
    operationMode: ControlSchemeBindingType,
    ioOutputPortModeNames: PortModeName[],
): boolean {
    const ioOuputPortModeNamesSet = new Set(ioOutputPortModeNames);
    return REQUIRED_PORT_MODES_FOR_OPERATION_MODE[operationMode].every((requiredPortModeName) =>
        ioOuputPortModeNamesSet.has(requiredPortModeName)
    ) ?? false;
}
