import { MonoTypeOperatorFunction, delay, interval, map, merge, of, startWith, switchMap, timer } from 'rxjs';
import { TaskInput } from '@app/store';
import { CONTROLLER_NULL_INPUT_VALUE } from '@app/controller-profiles';

export function pulseInputPipe(periodMs: number, dutyCycle: number): MonoTypeOperatorFunction<TaskInput | undefined> {
  return (source) =>
    source.pipe(
      switchMap((input) => {
        if (!input?.isActivated) {
          return of(input);
        }

        const initial = of(false).pipe(delay(periodMs * dutyCycle), startWith(true));
        const following = interval(periodMs).pipe(
          switchMap(() =>
            timer(periodMs * dutyCycle).pipe(
              map(() => false),
              startWith(true),
            ),
          ),
        );
        return merge(initial, following).pipe(
          map((isOn) => {
            if (isOn) {
              return {
                ...input,
                timestamp: Date.now(),
              };
            }
            return {
              value: CONTROLLER_NULL_INPUT_VALUE,
              isActivated: false,
              timestamp: Date.now(),
            };
          }),
        );
      }),
    );
}
