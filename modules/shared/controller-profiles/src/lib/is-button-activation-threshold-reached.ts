import { GamepadButtonSettings } from './controller-settings';

export function isButtonActivationThresholdReached(value: number, settings?: GamepadButtonSettings): boolean {
  if (!settings) {
    return value > 0.5 || value < -0.5; // fallback, should never happen, (only if there is something wrong with the store)
  }
  if (settings.ignoreInput) {
    return false;
  }
  return Math.abs(value) >= settings.activationThreshold;
}
