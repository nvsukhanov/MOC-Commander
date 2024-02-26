import { InputGain } from '@app/store';

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

export function calcInputGain(
    value: number,
    gain: InputGain = InputGain.None,
): number {
    switch (gain) {
        case InputGain.None:
            return value;
        case InputGain.Exponential:
            return slopeFn(value, EXPONENTIAL_SLOPE_GAIN, EXPONENTIAL_SHARPNESS);
        case InputGain.Logarithmic:
            return slopeFn(value, LOGARITHMIC_SLOPE_GAIN, LOGARITHMIC_SHARPNESS);
    }
}
