import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '../../lego-hub';

export const HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS = createActionGroup({
    source: 'HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS',
    events: {
        'port modes received': props<{ hardwareRevision: string, softwareRevision: string, ioType: IOType, modes: number[] }>(),
    }
});
