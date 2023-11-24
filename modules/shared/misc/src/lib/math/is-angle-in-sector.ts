import { normalizeDegToPositive360 } from './normalize-deg-to-positive360';

export function isAngleInSector(
    angle: number,
    sectorStartAngle: number,
    sectorEndAngle: number
): boolean {
    const normalizedAngle = normalizeDegToPositive360(angle);
    const normalizedSectorStartAngle = normalizeDegToPositive360(sectorStartAngle);
    const normalizedSectorEndAngle = normalizeDegToPositive360(sectorEndAngle);

    if (normalizedSectorStartAngle < normalizedSectorEndAngle) {
        return normalizedAngle >= normalizedSectorStartAngle && normalizedAngle <= normalizedSectorEndAngle;
    } else {
        return normalizedAngle >= normalizedSectorStartAngle || normalizedAngle <= normalizedSectorEndAngle;
    }
}
