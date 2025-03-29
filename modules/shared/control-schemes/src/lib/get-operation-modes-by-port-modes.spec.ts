import { PortModeName } from 'rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { getOperationModesByPortModes } from './get-operation-modes-by-port-modes';

describe('getOperationModesByPortModes', () => {
  it('should return an empty array when no matching operation modes are found', () => {
    const portModeNames: PortModeName[] = [PortModeName.handsetRCKey];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toEqual([]);
  });

  it('should return an array of matching operation modes on full match', () => {
    const portModeNames: PortModeName[] = [PortModeName.position, PortModeName.speed, PortModeName.power];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toEqual([
      ControlSchemeBindingType.Speed,
      ControlSchemeBindingType.Stepper,
      ControlSchemeBindingType.Train,
      ControlSchemeBindingType.Accelerate,
    ]);
  });

  it('should not return operation modes on partial match', () => {
    const portModeNames: PortModeName[] = [PortModeName.position, PortModeName.speed];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toEqual([]);
  });

  it('should return ControlSchemeBindingType.Speed when both speed and power modes are present', () => {
    const portModeNames: PortModeName[] = [PortModeName.speed, PortModeName.power];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Speed);
  });

  it('should return ControlSchemeBindingType.Servo when all required modes are present', () => {
    const portModeNames: PortModeName[] = [
      PortModeName.absolutePosition,
      PortModeName.position,
      PortModeName.speed,
      PortModeName.power,
    ];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Servo);
  });

  it('should return ControlSchemeBindingType.SetAngle when all required modes are present', () => {
    const portModeNames: PortModeName[] = [
      PortModeName.absolutePosition,
      PortModeName.position,
      PortModeName.speed,
      PortModeName.power,
    ];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.SetAngle);
  });

  it('should return ControlSchemeBindingType.Stepper when all required modes are present', () => {
    const portModeNames: PortModeName[] = [PortModeName.position, PortModeName.speed, PortModeName.power];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Stepper);
  });

  it('should return ControlSchemeBindingType.Train when all required modes are present', () => {
    const portModeNames: PortModeName[] = [PortModeName.speed, PortModeName.power];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Train);
  });

  it('should return ControlSchemeBindingType.Gearbox when all required modes are present', () => {
    const portModeNames: PortModeName[] = [
      PortModeName.absolutePosition,
      PortModeName.position,
      PortModeName.speed,
      PortModeName.power,
    ];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Gearbox);
  });

  it('should return ControlSchemeBindingType.Accelerate when all required modes are present', () => {
    const portModeNames: PortModeName[] = [PortModeName.speed, PortModeName.power];
    const result = getOperationModesByPortModes(portModeNames);
    expect(result).toContain(ControlSchemeBindingType.Accelerate);
  });
});
