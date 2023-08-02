import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS } from '@app/store';

import { BindingEditViewPageModel } from './binding-edit-view-page-model';
import { BINDING_EDIT_SELECTORS, BindingEditAvailableOperationModesModel } from '../binding-edit';

export const BINDING_EDIT_PAGE_SELECTORS = {
    selectViewModel: createSelector(
        ROUTER_SELECTORS.selectCurrentlyEditedSchemeId,
        ROUTER_SELECTORS.selectCurrentlyEditedBindingId,
        CONTROL_SCHEME_SELECTORS.selectEntities,
        BINDING_EDIT_SELECTORS.selectBindingEditAvailableOperationModes,
        (
            controlSchemeId: string | null,
            bindingId: string | null,
            schemes: Dictionary<ControlSchemeModel>,
            availabilityData: BindingEditAvailableOperationModesModel
        ): BindingEditViewPageModel | null => {
            if (controlSchemeId === null || bindingId === null) {
                return null;
            }
            const scheme = schemes[controlSchemeId];
            if (!scheme) {
                return null;
            }
            const binding = scheme.bindings.find((b) => b.id === bindingId);
            if (!binding) {
                return null;
            }
            return {
                binding,
                availabilityData,
                controlSchemeId
            };
        }
    )
};
