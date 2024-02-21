import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeBinding, ControlSchemeInput, ControllerConnectionModel } from '@app/store';

import { BindingTreeNodeViewModel, InputActionTreeNodeRecord } from './binding-tree-node-view-model';

export const INPUT_TREE_NODE_VIEW_MODEL_SELECTOR = (
    schemeName: string,
    binding: ControlSchemeBinding,
    ioHasNoRequiredCapabilities: boolean
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => createSelector(
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    (controllerConnectionEntities: Dictionary<ControllerConnectionModel>): BindingTreeNodeViewModel => {
        const result: BindingTreeNodeViewModel = {
            schemeName,
            binding,
            ioHasNoRequiredCapabilities,
            controlData: Object.entries(binding.inputs).map(([ action, input ]): InputActionTreeNodeRecord => {
                return {
                    action: +action as keyof ControlSchemeBinding['inputs'],
                    isControllerConnected: !!controllerConnectionEntities[(input as ControlSchemeInput).controllerId]
                };
            }),
            areAllControllersConnected: true
        };
        result.areAllControllersConnected = result.controlData.every((data) => data.isControllerConnected);

        return result;
    }
);
