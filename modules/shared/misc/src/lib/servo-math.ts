/**
 * Calculates the absolute position of a servo given the relative position of the servo (assuming the servo encoder is zeroed at absolute position 0).
 * e.g. 90 -> 90, 180 -> 180, 181 -> -179, 359 -> -1, 361 -> 1 etc
 * @param relativeDegrees
 */
export function transformRelativeDegToAbsoluteDeg(relativeDegrees: number): number {
  const absoluteDegrees = relativeDegrees % 360;
  if (absoluteDegrees > 180) {
    return absoluteDegrees - 360;
  }
  if (absoluteDegrees <= -180) {
    return absoluteDegrees + 360;
  }
  return absoluteDegrees || 0;
}

/**
 * Returns the translation arc required to get from sourcePOS to targetPOS by turning clockwise or counter-clockwise within the range of 0 to 360 degrees.
 * e.g. if sourcePOS is 720 and targetPOS is -270, then
 * 1. both sourcePOS and targetPOS will be normalized to 0 and 90 respectively
 * 2. cw path will be 90 and ccw path will be 270
 * @param sourcePOS - the source position in degrees
 * @param targetPOS - the target position in degrees
 */
export function getTranslationArcs(sourcePOS: number, targetPOS: number): { cw: number; ccw: number } {
  const normalizedSourcePOS = sourcePOS >= 0 ? sourcePOS % 360 : 360 + (sourcePOS % 360);
  const normalizedTargetPOS = targetPOS >= 0 ? targetPOS % 360 : 360 + (targetPOS % 360);

  if (normalizedSourcePOS === normalizedTargetPOS) {
    return { cw: 0, ccw: 0 };
  }
  return {
    cw: normalizedSourcePOS < normalizedTargetPOS ? normalizedTargetPOS - normalizedSourcePOS : 360 - normalizedSourcePOS + normalizedTargetPOS,
    ccw: normalizedSourcePOS < normalizedTargetPOS ? 360 - normalizedTargetPOS + normalizedSourcePOS : normalizedSourcePOS - normalizedTargetPOS,
  };
}
