import { createSelector } from '@ngrx/store';

import { PORT_TASKS_ENTITY_ADAPTER, PORT_TASKS_FEATURE, hubPortTasksIdFn } from '../reducers';
import { AttachedIoPropsModel, PortCommandTask } from '../models';
import { ATTACHED_IO_PROPS_SELECTORS } from './attached-io-props.selectors';

export type TaskExecutionData = {
    lastExecutedTask: PortCommandTask | null;
    runningTask: PortCommandTask | null;
    pendingTask: PortCommandTask | null;
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null;
};

export const PORT_TASKS_SELECTORS = {
    selectEntities: createSelector(
        PORT_TASKS_FEATURE.selectPortTasksState,
        PORT_TASKS_ENTITY_ADAPTER.getSelectors().selectEntities
    ),
    selectLastExecutedTask: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        PORT_TASKS_SELECTORS.selectEntities,
        (entities) => entities[hubPortTasksIdFn(q)]?.lastExecutedTask ?? null
    ),
    selectRunningTask: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        PORT_TASKS_SELECTORS.selectEntities,
        (entities) => entities[hubPortTasksIdFn(q)]?.runningTask ?? null
    ),
    selectPendingTask: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        PORT_TASKS_SELECTORS.selectEntities,
        (entities) => entities[hubPortTasksIdFn(q)]?.pendingTask ?? null
    ),
    selectTaskExecutionData: (
        { hubId, portId }: { hubId: string; portId: number }
    ) => createSelector(
        ATTACHED_IO_PROPS_SELECTORS.selectById({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectPendingTask({ hubId, portId }),
        (ioProps, runningTask, lastExecutedTask, pendingTask): TaskExecutionData => {
            return {
                ioProps: ioProps ?? null,
                runningTask,
                lastExecutedTask,
                pendingTask
            };
        }
    ),
} as const;
