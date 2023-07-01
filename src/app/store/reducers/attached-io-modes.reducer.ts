import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { IOType } from '@nvsukhanov/rxpoweredup';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AttachedIoModesModel } from '../models';
import { ATTACHED_IO_MODES_ACTIONS } from '../actions';

export type AttachedIoModesState = EntityState<AttachedIoModesModel>;

export const ATTACHED_IO_MODES_ENTITY_ADAPTER: EntityAdapter<AttachedIoModesModel> = createEntityAdapter<AttachedIoModesModel>({
    selectId: (mode) => mode.id,
});

export function attachedIoModesIdFn(
    { hardwareRevision, softwareRevision, ioType }: { hardwareRevision: string, softwareRevision: string, ioType: IOType }
): string {
    return `${hardwareRevision}/${softwareRevision}/${ioType}`;
}

export const ATTACHED_IO_MODES_INITIAL_STATE = ATTACHED_IO_MODES_ENTITY_ADAPTER.getInitialState();

export const ATTACHED_IO_MODES_FEATURE = createFeature({
    name: 'attachedIoModes',
    reducer: createReducer(
        ATTACHED_IO_MODES_INITIAL_STATE,
        on(ATTACHED_IO_MODES_ACTIONS.portModesReceived, (state, data): AttachedIoModesState => ATTACHED_IO_MODES_ENTITY_ADAPTER.addOne({
            id: attachedIoModesIdFn(data.io),
            portInputModes: data.portInputModes,
            portOutputModes: data.portOutputModes,
            synchronizable: data.synchronizable
        }, state))
    )
});
