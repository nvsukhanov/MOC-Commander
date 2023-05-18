import { createActionGroup, props } from '@ngrx/store';
import { PortCommandTask } from '../../common';

export const HUB_PORT_TASKS_ACTIONS = createActionGroup({
    source: 'Hub Port Tasks',
    events: {
        'set queue': props<{ tasks: PortCommandTask[] }>(),
        'mark task as executed': props<{ task: PortCommandTask }>(),
    }
});
