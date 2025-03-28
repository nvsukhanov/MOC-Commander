import { MOTOR_LIMITS } from 'rxpoweredup';

export function clampSpeed(speed: number): number {
  return Math.max(MOTOR_LIMITS.minSpeed, Math.min(MOTOR_LIMITS.maxSpeed, speed));
}
