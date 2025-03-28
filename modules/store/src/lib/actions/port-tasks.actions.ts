import { createActionGroup, props } from '@ngrx/store';

import { PortCommandTask } from '../models';

export const PORT_TASKS_ACTIONS = createActionGroup({
  source: 'PortTasks',
  events: {
    setPendingTask: props<{ hubId: string; portId: number; pendingTask: PortCommandTask }>(),
    clearPendingTask: props<{ hubId: string; portId: number }>(),
    runTask: props<{ task: PortCommandTask }>(),
    taskExecuted: props<{ task: PortCommandTask }>(),
    taskExecutionFailed: props<{ task: PortCommandTask }>(),
  },
});
