const SPEED_STEP = 5;

const SPEED_SNAP_THRESHOLD = 10;

export function snapSpeed(speed: number): number {
  const speedWithStep = Math.round(speed / SPEED_STEP) * SPEED_STEP;
  if (Math.abs(speedWithStep) < SPEED_SNAP_THRESHOLD) {
    return 0;
  }
  return Math.round(speed);
}
