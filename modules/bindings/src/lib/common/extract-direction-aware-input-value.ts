import { InputDirection } from '@app/store';

export function extractDirectionAwareInputValue(
    value: number,
    direction: InputDirection
): number {
    switch (direction) {
        case InputDirection.Positive:
            return Math.max(0, value);
        case InputDirection.Negative:
            return Math.min(0, value);
    }
}
