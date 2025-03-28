import { clampSpeed } from './clamp-speed';

export function calculateSpeedPower(cumulativeSpeed: number, brakeFactor: number, power: number): { speed: number; power: number } {
  const resultingSpeed = Math.max(0, Math.abs(cumulativeSpeed) - brakeFactor) * Math.sign(cumulativeSpeed);
  const resultingPower = resultingSpeed !== 0 || brakeFactor !== 0 ? power : 0;
  const clampedSpeed = clampSpeed(resultingSpeed);
  return {
    speed: clampedSpeed,
    power: resultingPower,
  };
}
