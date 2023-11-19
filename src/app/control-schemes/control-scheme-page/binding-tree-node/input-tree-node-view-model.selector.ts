import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeInputAction, ControlSchemeInputsRecord, ControllerConnectionModel } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { BindingTreeNodeRecord, BindingTreeNodeViewModel } from './binding-tree-node-view-model';

export const INPUT_TREE_NODE_VIEW_MODEL_SELECTOR = (
    schemeName: string,
    inputs: ControlSchemeInputsRecord,
    operationMode: ControlSchemeBindingType,
    bindingId: number,
    ioHasNoRequiredCapabilities: boolean
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => createSelector(
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    (controllerConnectionEntities: Dictionary<ControllerConnectionModel>): BindingTreeNodeViewModel => {
        const result: BindingTreeNodeViewModel = {
            schemeName,
            bindingId,
            ioHasNoRequiredCapabilities,
            operationMode,
            controlData: Object.entries(inputs).map(([ action, input ]): BindingTreeNodeRecord => {
                return {
                    action: +action as ControlSchemeInputAction,
                    input,
                    isControllerConnected: !!controllerConnectionEntities[input.controllerId]
                };
            }).filter((data) => !!data.input.controllerId),
            areAllControllersConnected: true
        };
        result.areAllControllersConnected = result.controlData.every((data) => data.isControllerConnected);

        return result;
    }
);
