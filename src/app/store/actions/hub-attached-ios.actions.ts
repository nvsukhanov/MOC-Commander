import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '@nvsukhanov/poweredup-api';

export const HUB_ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'HUB_ATTACHED_IOS_ACTIONS',
    events: {
        'registerIO': props<{
            hubId: string,
            portId: number,
            ioType: IOType,
            hardwareRevision: string,
            softwareRevision: string,
        }>(),
        'unregisterIO': props<{ hubId: string, portId: number }>(),
    }
});
