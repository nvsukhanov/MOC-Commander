import { createActionGroup, props } from '@ngrx/store';

import { PortCommandTask } from '../models';

export const PORT_TASKS_ACTIONS = createActionGroup({
    source: 'PortTasks',
    events: {
        'set pending task': props<{ hubId: string; portId: number; pendingTask: PortCommandTask }>(),
        'clear pending task': props<{ hubId: string; portId: number }>(),
        'run task': props<{ task: PortCommandTask }>(),
        'task executed': props<{ task: PortCommandTask }>(),
        'task execution failed': props<{ task: PortCommandTask }>(),
    }
});
