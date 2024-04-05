import { MonoTypeOperatorFunction, map } from 'rxjs';
import { InputPipeType, TaskInput } from '@app/store';

import { exponentialInputGain, logarithmicInputGain } from '../calc-input-gain';

export function applyGainInputPipe(
    gain: InputPipeType.LogarithmicGain | InputPipeType.ExponentialGain
): MonoTypeOperatorFunction<TaskInput | undefined> {
    return (source) => source.pipe(
        map((input) => {
            if (!input) {
                return;
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
