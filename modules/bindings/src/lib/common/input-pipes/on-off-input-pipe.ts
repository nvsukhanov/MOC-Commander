import { MonoTypeOperatorFunction, distinctUntilChanged, pairwise, scan } from 'rxjs';
import { TaskInput } from '@app/store';
import { CONTROLLER_MAX_INPUT_VALUE, CONTROLLER_NULL_INPUT_VALUE } from '@app/controller-profiles';

export function onOffInputPipe(): MonoTypeOperatorFunction<TaskInput | undefined> {
  return (source) =>
    source.pipe(
      pairwise(),
      scan((acc: TaskInput | undefined, [prev, curr]: [TaskInput | undefined, TaskInput | undefined]) => {
        if (prev?.isActivated === curr?.isActivated) {
          return acc;
        }
        if (curr?.isActivated) {
          if (!acc?.isActivated) {
            return {
              ...curr,
              value: CONTROLLER_MAX_INPUT_VALUE,
            };
          } else {
            return {
              ...curr,
              isActivated: false,
              value: CONTROLLER_NULL_INPUT_VALUE,
            };
          }
        }
        return acc;
      }, undefined),
      distinctUntilChanged(),
    );
}
