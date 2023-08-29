import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS } from '@app/store';

export const BINDING_EDIT_PAGE_SELECTORS = {
    selectEditedBinding: createSelector(
        ROUTER_SELECTORS.selectCurrentlyEditedSchemeId,
        ROUTER_SELECTORS.selectCurrentlyEditedBindingId,
        CONTROL_SCHEME_SELECTORS.selectEntities,
        (schemeId: string | null, bindingId: string | null, controlSchemeEntities: Dictionary<ControlSchemeModel>) => {
            if (schemeId === null || bindingId === null) {
                return undefined;
            }
            return controlSchemeEntities[schemeId]?.bindings.find((b) => b.id === bindingId) ?? undefined;
        }
    )
};
