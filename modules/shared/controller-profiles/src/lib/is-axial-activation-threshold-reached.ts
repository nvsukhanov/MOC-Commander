import { GamepadAxisSettings } from './controller-settings';

export function isAxialActivationThresholdReached(value: number, settings: GamepadAxisSettings): boolean {
  if (settings.ignoreInput) {
    return false;
  }
  return Math.abs(value) >= settings.activationThreshold;
}
