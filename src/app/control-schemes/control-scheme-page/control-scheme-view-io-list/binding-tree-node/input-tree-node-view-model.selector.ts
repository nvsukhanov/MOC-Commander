import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeInputAction, ControlSchemeInputsRecord, ControllerConnectionModel } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { BindingTreeNodeRecord, BindingTreeNodeViewModel } from './binding-tree-node-view-model';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const INPUT_TREE_NODE_VIEW_MODEL_SELECTOR = (
    controlSchemeId: string,
    inputs: ControlSchemeInputsRecord,
    operationMode: ControlSchemeBindingType,
    bindingId: string,
    isActive: boolean,
    ioHasNoRequiredCapabilities: boolean
) => createSelector(
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    (controllerConnectionEntities: Dictionary<ControllerConnectionModel>): BindingTreeNodeViewModel => {
        return {
            controlSchemeId,
            bindingId,
            isActive,
            ioHasNoRequiredCapabilities,
            operationMode,
            controlData: Object.entries(inputs).map(([ action, input ]): BindingTreeNodeRecord => {
                return {
                    action: action as ControlSchemeInputAction,
                    input,
                    isControllerConnected: !!controllerConnectionEntities[input.controllerId]
                };
            }).filter((data) => !!data.input.controllerId)
        };
    }
);
