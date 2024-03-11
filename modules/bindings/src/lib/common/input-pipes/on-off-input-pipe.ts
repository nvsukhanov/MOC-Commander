import { MonoTypeOperatorFunction, distinctUntilChanged, pairwise, scan } from 'rxjs';
import { ControllerInputModel } from '@app/store';

export function onOffInputPipe(): MonoTypeOperatorFunction<ControllerInputModel | null> {
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
