import { MonoTypeOperatorFunction, distinctUntilChanged, of, pairwise, scan } from 'rxjs';
import { ControlSchemeInput, ControllerInputModel } from '@app/store';

// Unused currently, but will be used in the future when input pipes are implemented
export function onOffInputPipe(
    inputConfig?: ControlSchemeInput
): MonoTypeOperatorFunction<ControllerInputModel | null> {
    if (!inputConfig) {
        return () => of(null);
    }
    return (source) => source.pipe(
        pairwise(),
        scan((acc: ControllerInputModel | null, [prev, curr]: [ControllerInputModel | null, ControllerInputModel | null]) => {
            if (prev?.isActivated === curr?.isActivated) {
                return acc;
            }
            if (curr?.isActivated) {
                if (!acc?.isActivated) {
                    return {
                        ...curr,
                        value: 1
                    };
                } else {
                    return {
                        ...curr,
                        isActivated: false,
                        value: 0
                    };
                }
            }
            return acc;
        }, null),
        distinctUntilChanged(),
    );
}
