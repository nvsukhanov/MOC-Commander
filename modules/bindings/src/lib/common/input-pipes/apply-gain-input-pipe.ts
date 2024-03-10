import { MonoTypeOperatorFunction, map } from 'rxjs';
import { ControllerInputModel, InputGain } from '@app/store';

import { calcInputGain } from '../calc-input-gain';

export function applyGainInputPipe(
    gain: InputGain
): MonoTypeOperatorFunction<ControllerInputModel | null> {
    return (source) => source.pipe(
        map((input) => {
            if (!input) {
                return null;
            }
            return {
                ...input,
                value: calcInputGain(input.value, gain)
            };
        }),
    );
}
