import { createActionGroup, props } from '@ngrx/store';
import { IOType, PortModeName, PortModeSymbol } from '../../lego-hub';

export const HUB_PORT_MODE_INFO_ACTIONS = createActionGroup({
    source: 'HUB_PORT_MODE_INFO_ACTIONS',
    events: {
        'add port mode data': props<{
            modeId: number,
            hardwareRevision: string,
            softwareRevision: string,
            ioType: IOType,
            name: PortModeName,
            symbol: PortModeSymbol
        }>()
    }
});
