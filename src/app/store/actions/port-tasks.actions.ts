import { createActionGroup, props } from '@ngrx/store';

import { PortCommandTask } from '../models';

export const PORT_TASKS_ACTIONS = createActionGroup({
    source: 'PortTasks',
    events: {
        'update queue': props<{ hubId: string; portId: number; queue: PortCommandTask[] }>(),
        'run task': props<{ task: PortCommandTask }>(),
        'task executed': props<{ task: PortCommandTask }>(),
    }
});
