import { EntityState, Update, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { PortTasksModel } from '../models';
import { CONTROL_SCHEME_ACTIONS, PORT_TASKS_ACTIONS } from '../actions';

export type PortTasksState = EntityState<PortTasksModel>;

export const PORT_TASKS_ENTITY_ADAPTER = createEntityAdapter<PortTasksModel>({
    selectId: (task) => hubPortTasksIdFn(task),
});

export function hubPortTasksIdFn(
    { hubId, portId }: { hubId: string; portId: number }
): string {
    return `${hubId}/${portId}`;
}

export const PORT_TASKS_FEATURE = createFeature({
    name: 'portTasks',
    reducer: createReducer(
        PORT_TASKS_ENTITY_ADAPTER.getInitialState(),
        on(PORT_TASKS_ACTIONS.updateQueue, (state, { hubId, portId, queue }): PortTasksState => {
            return PORT_TASKS_ENTITY_ADAPTER.upsertOne({
                hubId,
                portId,
                queue,
                runningTask: state.entities[hubPortTasksIdFn({ hubId, portId })]?.runningTask ?? null,
                lastExecutedTask: state.entities[hubPortTasksIdFn({ hubId, portId })]?.lastExecutedTask ?? null,
            }, state);
        }),
        on(PORT_TASKS_ACTIONS.runTask, (state, { task }): PortTasksState => {
            const nextQueue = [ ...(state.entities[hubPortTasksIdFn(task)]?.queue ?? []) ].filter((queueItem) => queueItem !== task);
            return PORT_TASKS_ENTITY_ADAPTER.upsertOne({
                hubId: task.hubId,
                portId: task.portId,
                queue: nextQueue,
                runningTask: task,
                lastExecutedTask: state.entities[hubPortTasksIdFn(task)]?.lastExecutedTask ?? null,
            }, state);
        }),
        on(PORT_TASKS_ACTIONS.taskExecuted, (state, { task }): PortTasksState => {
            const runningTask = state.entities[hubPortTasksIdFn(task)]?.runningTask ?? null;
            return PORT_TASKS_ENTITY_ADAPTER.upsertOne({
                hubId: task.hubId,
                portId: task.portId,
                queue: state.entities[hubPortTasksIdFn(task)]?.queue ?? [],
                runningTask: runningTask === task ? null : runningTask,
                lastExecutedTask: task,
            }, state);
        }),
        on(CONTROL_SCHEME_ACTIONS.stopScheme, (state) => {
            return PORT_TASKS_ENTITY_ADAPTER.updateMany(
                state.ids.map((id) => {
                    const entity = state.entities[id];
                    if (!entity) {
                        return null;
                    }
                    return {
                        id,
                        changes: {
                            queue: [],
                        } as Partial<PortTasksModel>,
                    };
                }).filter((update): update is Update<PortTasksModel> => !!update),
                state
            );
        }),
        on(CONTROL_SCHEME_ACTIONS.schemeStopped, () => PORT_TASKS_ENTITY_ADAPTER.getInitialState()),
    ),
});
