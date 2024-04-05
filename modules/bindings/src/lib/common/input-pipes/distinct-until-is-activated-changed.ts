import { MonoTypeOperatorFunction, distinctUntilChanged } from 'rxjs';
import { TaskInput } from '@app/store';

export function distinctUntilIsActivatedChanged(): MonoTypeOperatorFunction<TaskInput | undefined> {
    return (source) => source.pipe(
        distinctUntilChanged((prev, next) => {
            return prev?.isActivated === next?.isActivated;
        })
    );
}
