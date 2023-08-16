import { createSelector } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeInput } from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { BindingTreeNodeViewModel } from './binding-tree-node-view-model';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const SINGLE_INPUT_TREE_NODE_VIEW_MODEL_SELECTOR = (
    controlSchemeId: string,
    singleInputBinding: ControlSchemeInput,
    operationMode: HubIoOperationMode,
    bindingId: string,
    isActive: boolean,
    ioHasNoRequiredCapabilities: boolean
) => createSelector(
    CONTROLLER_CONNECTION_SELECTORS.isConnected(singleInputBinding.controllerId),
    (isControllerConnected: boolean): BindingTreeNodeViewModel => {
        return {
            controlSchemeId,
            bindingId,
            isActive,
            ioHasNoRequiredCapabilities,
            operationMode,
            controlData: [ {
                input: singleInputBinding,
                isControllerConnected
            } ]
        };
    }
);
