import { createActionGroup, props } from '@ngrx/store';
import { PortCommandTask } from '../../types';

export const HUB_IO_STATE_ACTIONS = createActionGroup({
    source: 'HUB_IO_STATE_ACTIONS',
    events: {
        'set last executed task': props<{ hubId: string, portId: number, lastExecutedTask: PortCommandTask }>()
    }
});
