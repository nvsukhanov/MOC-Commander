import { createActionGroup, props } from '@ngrx/store';

import { AttachedIO } from '../i-state';

export const HUB_IO_SUPPORTED_MODES = createActionGroup({
    source: 'HUB_IO_OUTPUT_MODES',
    events: {
        'port modes received': props<{
            io: AttachedIO,
            portInputModes: number[]
            portOutputModes: number[],
            synchronizable: boolean
        }>(),
    }
});
