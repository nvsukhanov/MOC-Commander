import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '@nvsukhanov/rxpoweredup';

export const HUB_VIRTUAL_PORT_ACTIONS = createActionGroup({
    source: 'Hub Virtual Port Actions',
    events: {
        'create virtual port': props<{ hubId: string, portIdA: number, portIdB: number }>(),
        'virtual port created': props<{ hubId: string, portId: number, ioType: IOType, portIdA: number, portIdB: number }>(),
        'delete virtual port': props<{ hubId: string, portId: number }>(),
        'virtual port deleted': props<{ hubId: string, portId: number }>()
    }
});
