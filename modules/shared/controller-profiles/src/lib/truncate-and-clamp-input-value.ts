import { CONTROLLER_MAX_INPUT_VALUE, CONTROLLER_MIN_INPUT_VALUE } from './i-controllers-config';

export function truncateAndClampInputValue(
    value: number,
): number {
    return Math.min(
        CONTROLLER_MAX_INPUT_VALUE,
        Math.max(
            CONTROLLER_MIN_INPUT_VALUE,
            Math.round((value + Number.EPSILON) * 100) / 100
        )
    );
}
