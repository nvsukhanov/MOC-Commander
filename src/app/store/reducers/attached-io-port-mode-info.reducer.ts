import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { IOType } from 'rxpoweredup';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AttachedIoPortModeInfoModel } from '../models';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions';

export type AttachedIoPortModeInfoState = EntityState<AttachedIoPortModeInfoModel>;

export const ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER: EntityAdapter<AttachedIoPortModeInfoModel> = createEntityAdapter<AttachedIoPortModeInfoModel>({
    selectId: (mode) => mode.id,
});

export function attachedIoPortModeInfoIdFn(
    { hardwareRevision, softwareRevision, ioType, modeId }: { hardwareRevision: string; softwareRevision: string; ioType: IOType; modeId: number }
): string {
    return `${hardwareRevision}/${softwareRevision}/${ioType}/${modeId}`;
}

export const ATTACHED_IO_PORT_MODE_INFO_INITIAL_STATE = ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.getInitialState();

export const ATTACHED_IO_PORT_MODE_INFO_FEATURE = createFeature({
    name: 'attachedIoPortModeInfo',
    reducer: createReducer(
        ATTACHED_IO_PORT_MODE_INFO_INITIAL_STATE,
        on(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData,
            (state, data): AttachedIoPortModeInfoState => ATTACHED_IO_PORT_MODE_INFO_ENTITY_ADAPTER.addMany(data.dataSets, state))
    ),
});
