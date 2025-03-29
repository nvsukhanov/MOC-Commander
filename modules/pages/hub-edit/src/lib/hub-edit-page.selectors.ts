import { createSelector } from '@ngrx/store';
import {
  HUBS_SELECTORS,
  HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS,
  HUB_RUNTIME_DATA_SELECTORS,
  HubModel,
  ROUTER_SELECTORS,
} from '@app/store';

export const HUB_EDIT_PAGE_SELECTORS = {
  selectEditedHubModel: createSelector(
    ROUTER_SELECTORS.selectCurrentlyEditedHubId,
    HUBS_SELECTORS.selectEntities,
    (hubId, hubs): HubModel | undefined => {
      return hubId !== null ? hubs[hubId] : undefined;
    },
  ),
  selectIsEditedHubConnected: createSelector(
    ROUTER_SELECTORS.selectCurrentlyEditedHubId,
    HUB_RUNTIME_DATA_SELECTORS.selectIds,
    (hubId, hubRuntimeDataIds): boolean => {
      return hubId !== null && hubRuntimeDataIds.includes(hubId);
    },
  ),
  selectIsEditedHubIsSaving: createSelector(
    ROUTER_SELECTORS.selectCurrentlyEditedHubId,
    HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS.currentlySavingHubIds,
    (hubId, hubIds): boolean => {
      return hubId !== null && hubIds.includes(hubId);
    },
  ),
};
