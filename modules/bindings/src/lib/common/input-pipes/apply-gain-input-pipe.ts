import { MonoTypeOperatorFunction, map } from 'rxjs';
import { ControllerInputModel, InputPipeType } from '@app/store';

import { exponentialInputGain, logarithmicInputGain } from '../calc-input-gain';

export function applyGainInputPipe(
    gain: InputPipeType.LogarithmicGain | InputPipeType.ExponentialGain
): MonoTypeOperatorFunction<ControllerInputModel | null> {
    return (source) => source.pipe(
        map((input) => {
            if (!input) {
                return null;
            }
            return {
                ...input,
                value: gain === InputPipeType.LogarithmicGain
                    ? logarithmicInputGain(input.value)
                    : exponentialInputGain(input.value)
            };
        }),
    );
}
