import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '@nvsukhanov/rxpoweredup';

import { AttachedIO } from '../i-state';

export const HUB_ATTACHED_IOS_ACTIONS = createActionGroup({
    source: 'Hub Attached IOs',
    events: {
        'io connected': props<{ io: AttachedIO }>(),
        'io disconnected': props<{ hubId: string, portId: number }>(),
        'create virtual port': props<{ hubId: string, portIdA: number, portIdB: number }>(),
        'virtual port created': props<{ hubId: string, portId: number, ioType: IOType, portIdA: number, portIdB: number }>(),
        'delete virtual port': props<{ hubId: string, portIdA: number, portIdB: number, portId: number }>(),
        'delete all virtual ports': props<{ hubId: string }>(),
        'virtual port deleted': props<{ hubId: string, portId: number }>(),
    }
});
