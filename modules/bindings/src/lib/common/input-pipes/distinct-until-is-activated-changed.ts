import { MonoTypeOperatorFunction, distinctUntilChanged } from 'rxjs';
import { ControllerInputModel } from '@app/store';

export function distinctUntilIsActivatedChanged(): MonoTypeOperatorFunction<ControllerInputModel | null> {
    return (source) => source.pipe(
        distinctUntilChanged((prev, next) => {
            return prev?.isActivated === next?.isActivated;
        })
    );
}
