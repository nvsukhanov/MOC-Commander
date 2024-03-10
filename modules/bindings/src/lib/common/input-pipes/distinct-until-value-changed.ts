import { MonoTypeOperatorFunction, distinctUntilChanged } from 'rxjs';
import { ControllerInputModel } from '@app/store';

export function distinctUntilValueChanged(): MonoTypeOperatorFunction<ControllerInputModel | null> {
    return (source) => source.pipe(
        distinctUntilChanged((prev, next) => {
            return prev?.value === next?.value;
        })
    );
}
