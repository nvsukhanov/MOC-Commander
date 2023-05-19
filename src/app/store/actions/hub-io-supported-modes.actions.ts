import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '@nvsukhanov/rxpoweredup';

export const HUB_IO_SUPPORTED_MODES = createActionGroup({
    source: 'HUB_IO_OUTPUT_MODES',
    events: {
        'port modes received': props<{
            hardwareRevision: string,
            softwareRevision: string,
            ioType: IOType,
            portInputModes: number[]
            portOutputModes: number[]
        }>(),
    }
});
