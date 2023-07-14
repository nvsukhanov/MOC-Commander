import { createSelector } from '@ngrx/store';

import { PORT_TASKS_ENTITY_ADAPTER, PORT_TASKS_FEATURE, controllerInputIdFn, hubPortTasksIdFn } from '../reducers';
import { ControlSchemeBinding, PortCommandTask } from '../models';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';
import { ATTACHED_IO_PROPS_SELECTORS } from './attached-io-props.selectors';

const SELECT_ALL = createSelector(
    PORT_TASKS_FEATURE.selectPortTasksState,
    PORT_TASKS_ENTITY_ADAPTER.getSelectors().selectAll
);

export type BindingTaskComposingData = {
    hubId: string;
    portId: number;
    bindingWithValue: Array<{ binding: ControlSchemeBinding; value: number }>;
    encoderOffset: number;
    lastExecutedTask: PortCommandTask | null;
    runningTask: PortCommandTask | null;
    queue: PortCommandTask[];
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
    selectQueue: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        PORT_TASKS_SELECTORS.selectEntities,
        (entities) => entities[hubPortTasksIdFn(q)]?.queue ?? []
    ),
    selectFirstItemInQueue: (
        q: { hubId: string; portId: number }
    ) => createSelector(
        PORT_TASKS_SELECTORS.selectQueue(q),
        (queue) => queue[0] ?? null
    ),
    selectLastExecutedBindingIds: createSelector(
        SELECT_ALL,
        (items) => {
            const result: Set<string> = new Set();
            for (const item of items) {
                if (item.lastExecutedTask) {
                    result.add(item.lastExecutedTask.bindingId);
                }
            }
            return result;
        }
    ),
    selectBindingTaskCreationModel: (
        { hubId, portId, bindings }: { hubId: string; portId: number; bindings: ControlSchemeBinding[] }
    ) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectQueue({ hubId, portId }),
        (inputEntities, encoderOffset, runningTask, lastExecutedTask, queue): BindingTaskComposingData => {
            return {
                encoderOffset,
                runningTask,
                lastExecutedTask,
                hubId,
                portId,
                queue,
                bindingWithValue: bindings.map((binding) => {
                    const input = inputEntities[controllerInputIdFn(binding.input)];
                    return {
                        binding,
                        value: input ? input.value : 0
                    };
                })
            };
        }
    )
} as const;
