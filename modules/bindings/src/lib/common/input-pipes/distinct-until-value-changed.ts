import { MonoTypeOperatorFunction, distinctUntilChanged } from 'rxjs';
import { TaskInput } from '@app/store';

export function distinctUntilValueChanged(): MonoTypeOperatorFunction<TaskInput | undefined> {
    return (source) => source.pipe(
        distinctUntilChanged((prev, next) => {
            return prev?.value === next?.value;
        })
    );
}
