import { PortModeName } from 'rxpoweredup';
import { ControlSchemeBindingType, getEnumValues } from '@app/shared-misc';

export const POWER_BINDING_PORT_MODES = [PortModeName.power, PortModeName.lpf2Train, PortModeName.lpf2MMotor];

export function getOperationModesByPortModes(portModeNames: PortModeName[]): ControlSchemeBindingType[] {
  return getEnumValues(ControlSchemeBindingType).filter((bindingType) => {
    switch (bindingType) {
      case ControlSchemeBindingType.Speed:
      case ControlSchemeBindingType.Train:
      case ControlSchemeBindingType.Accelerate:
        return [PortModeName.speed, PortModeName.power].every((i) => portModeNames.includes(i));
      case ControlSchemeBindingType.Stepper:
        return [PortModeName.position, PortModeName.speed, PortModeName.power].every((i) => portModeNames.includes(i));
      case ControlSchemeBindingType.Servo:
      case ControlSchemeBindingType.SetAngle:
      case ControlSchemeBindingType.Gearbox:
        return [PortModeName.absolutePosition, PortModeName.position, PortModeName.speed, PortModeName.power].every(
          (i) => portModeNames.includes(i),
        );
      case ControlSchemeBindingType.Power:
        return POWER_BINDING_PORT_MODES.some((i) => portModeNames.includes(i));
    }
  });
}
