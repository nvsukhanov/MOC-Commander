import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { HubIoOperationMode } from '@app/shared';

const REQUIRED_PORT_MODES_FOR_OPERATION_MODE: { [k in HubIoOperationMode]?: PortModeName[] } = {
    [HubIoOperationMode.Linear]: [ PortModeName.speed ],
    [HubIoOperationMode.Servo]: [ PortModeName.absolutePosition, PortModeName.position ],
    [HubIoOperationMode.SetAngle]: [ PortModeName.absolutePosition, PortModeName.position ],
    [HubIoOperationMode.Stepper]: [ PortModeName.position ]
};

export function ioHasMatchingModeForOpMode(
    operationMode: HubIoOperationMode,
    ioOutputPortModeNames: PortModeName[],
): boolean {
    return REQUIRED_PORT_MODES_FOR_OPERATION_MODE[operationMode]?.some((requiredPortModeName) =>
        ioOutputPortModeNames.includes(requiredPortModeName)
    ) ?? false;
}
