import { CONTROLLER_NULL_INPUT_VALUE } from './i-controllers-config';

export function applyActiveZoneToInputValue(value: number, activeZoneStart: number, activeZoneEnd: number): number {
  const absValue = Math.abs(value);
  const sign = Math.sign(value);

  if (absValue < activeZoneStart) {
    return CONTROLLER_NULL_INPUT_VALUE;
  }

  if (absValue > activeZoneEnd) {
    return sign;
  }

  return sign * ((absValue - activeZoneStart) / (activeZoneEnd - activeZoneStart));
}
