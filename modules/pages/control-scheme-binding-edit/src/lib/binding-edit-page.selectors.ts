import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS } from '@app/store';

export const BINDING_EDIT_PAGE_SELECTORS = {
    selectEditedBinding: createSelector(
        ROUTER_SELECTORS.selectCurrentlyEditedSchemeName,
        ROUTER_SELECTORS.selectCurrentlyEditedBindingId,
        CONTROL_SCHEME_SELECTORS.selectEntities,
        (schemeName: string | null, bindingId: number | null, controlSchemeEntities: Dictionary<ControlSchemeModel>) => {
            if (schemeName === null || bindingId === null) {
                return null;
            }
            return controlSchemeEntities[schemeName]?.bindings.find((b) => b.id === bindingId) ?? null;
        }
    )
};
