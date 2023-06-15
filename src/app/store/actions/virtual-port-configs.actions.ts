import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '@nvsukhanov/rxpoweredup';

export const VIRTUAL_PORTS_ACTIONS = createActionGroup({
    source: 'Virtual Ports',
    events: {
        'create virtual port': props<{
            hubId: string;
            name: string;
            portIdA: number;
            ioAType: IOType;
            ioAHardwareRevision: string;
            ioASoftwareRevision: string;
            portIdB: number;
            ioBType: IOType;
            ioBHardwareRevision: string;
            ioBSoftwareRevision: string;
        }>(),
        'delete virtual port': props<{ id: string, configName: string }>(),
    }
});
