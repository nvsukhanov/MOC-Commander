import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AttachedIOs } from './i-state';

export const ATTACHED_IO_ENTITY_ADAPTER: EntityAdapter<AttachedIOs> = createEntityAdapter<AttachedIOs>({
    selectId: (io) => io.portId,
    sortComparer: (a, b) => a.portId - b.portId
});

export const ATTACHED_ENTITY_SELECTORS = ATTACHED_IO_ENTITY_ADAPTER.getSelectors();
