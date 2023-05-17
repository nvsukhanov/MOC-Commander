import { createActionGroup, props } from '@ngrx/store';
import { PortCommandTask } from '../../common';

export const LAST_EXECUTED_TASKS_ACTIONS = createActionGroup({
    source: 'Last executed tasks',
    events: {
        'set last executed task': props<{ task: PortCommandTask }>(),
    }
});
