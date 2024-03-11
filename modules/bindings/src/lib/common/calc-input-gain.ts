const EXPONENTIAL_SLOPE_GAIN = 0.7;
const EXPONENTIAL_SHARPNESS = 3;
const LOGARITHMIC_SLOPE_GAIN = 0.7;
const LOGARITHMIC_SHARPNESS = 0.2;

function slopeFn(
    value: number,
    slopeGain: number,
    sharpness: number,
): number {
    return slopeGain * Math.pow(Math.abs(value), sharpness) * Math.sign(value) + (1 - slopeGain) * value;
}

export function logarithmicInputGain(
    value: number,
): number {
    return slopeFn(value, LOGARITHMIC_SLOPE_GAIN, LOGARITHMIC_SHARPNESS);
}

export function exponentialInputGain(
    value: number,
): number {
    return slopeFn(value, EXPONENTIAL_SLOPE_GAIN, EXPONENTIAL_SHARPNESS);
}
