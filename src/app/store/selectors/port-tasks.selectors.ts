import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import { PORT_TASKS_ENTITY_ADAPTER, PORT_TASKS_FEATURE, hubPortTasksIdFn } from '../reducers';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../models';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';
import { ATTACHED_IO_PROPS_SELECTORS } from './attached-io-props.selectors';

export type BindingTaskComposingData = {
    hubId: string;
    portId: number;
    bindings: ControlSchemeBinding[];
    inputState: Dictionary<ControllerInputModel>;
    encoderOffset: number;
    lastExecutedTask: PortCommandTask | null;
    runningTask: PortCommandTask | null;
    pendingTask: PortCommandTask | null;
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
    selectBindingTaskCreationModel: (
        { hubId, portId, bindings }: { hubId: string; portId: number; bindings: ControlSchemeBinding[] }
    ) => createSelector(
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectPendingTask({ hubId, portId }),
        (inputState, encoderOffset, runningTask, lastExecutedTask, pendingTask): BindingTaskComposingData => {
            return {
                encoderOffset,
                runningTask,
                lastExecutedTask,
                hubId,
                portId,
                pendingTask,
                bindings,
                inputState
            };
        }
    )
} as const;
