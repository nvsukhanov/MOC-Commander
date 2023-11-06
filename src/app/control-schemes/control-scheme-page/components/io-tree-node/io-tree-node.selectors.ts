import { IOType } from 'rxpoweredup';
import { MemoizedSelector, createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    HUB_RUNTIME_DATA_SELECTORS,
    PORT_TASKS_SELECTORS,
    PortCommandTask
} from '@app/store';

export interface IHubTreeNodeViewModel {
    ioType: IOType | null;
    portId: number;
    isConnected: boolean;
    useAccelerationProfile: boolean;
    accelerationTimeMs: number;
    useDecelerationProfile: boolean;
    decelerationTimeMs: number;
    runningTask: PortCommandTask | null;
    lastExecutedTask: PortCommandTask | null;
}

export const IO_TREE_NODE_SELECTORS = {
    selectViewModel: (
        { hubId, portId, schemeName, bindings }: { hubId: string; portId: number; schemeName: string; bindings: ControlSchemeBinding[] }
    ): MemoizedSelector<object, IHubTreeNodeViewModel> => createSelector(
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        HUB_RUNTIME_DATA_SELECTORS.selectIds,
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeName),
        PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }),
        PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }),
        (io, hubIds, scheme, runningTask, lastExecutedTask) => {
            const filteredBindings = bindings.filter((b) => b.portId === portId && b.hubId === hubId);
            const useAccelerationProfile = filteredBindings.some((b) => b.useAccelerationProfile);
            const useDecelerationProfile = filteredBindings.some((b) => b.useDecelerationProfile);
            const portConfig = scheme?.portConfigs.find((c) => c.portId === portId && c.hubId === hubId);
            return {
                ioType: io?.ioType ?? null,
                portId,
                isConnected: !!io && !!hubIds.find((id) => id === hubId),
                useAccelerationProfile,
                accelerationTimeMs: portConfig?.accelerationTimeMs ?? 0,
                useDecelerationProfile,
                decelerationTimeMs: portConfig?.decelerationTimeMs ?? 0,
                runningTask,
                lastExecutedTask,
            };
        }
    )
};

