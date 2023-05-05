import { createActionGroup, props } from '@ngrx/store';
import { IOType, PortModeName, PortModeSymbol } from '@nvsukhanov/poweredup-api';

export const HUB_PORT_MODE_INFO_ACTIONS = createActionGroup({
    source: 'HUB_PORT_MODE_INFO_ACTIONS',
    events: {
        'port mode data request': props<{
            hubId: string,
            portId: number,
            modeId: number,
            ioType: IOType,
            hardwareRevision: string,
            softwareRevision: string
        }>(),
        'add port mode data': props<{
            dataSets: Array<{
                modeId: number,
                hardwareRevision: string,
                softwareRevision: string,
                ioType: IOType,
                name: PortModeName,
                symbol: PortModeSymbol
            }>
        }>()
    }
});
