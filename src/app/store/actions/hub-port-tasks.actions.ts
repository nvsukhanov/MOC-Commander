import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PortCommandTask } from '../../control-scheme';

export const HUB_PORT_TASKS_ACTIONS = createActionGroup({
    source: 'Hub Port Tasks',
    events: {
        'add': props<{ tasks: PortCommandTask[] }>(),
        'execute task': props<{ task: PortCommandTask }>(),
        'clear queue': emptyProps(),
    }
});
