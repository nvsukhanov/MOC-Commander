import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { CONTROL_SCHEME_SELECTORS, ControlSchemeModel, HUBS_SELECTORS, HubModel, ROUTER_SELECTORS } from '@app/store';

import { PortConfigEditViewModel } from './port-config-edit-view-model';

export const PORT_CONFIG_EDIT_PAGE_SELECTORS = {
    selectPortConfig: createSelector(
        ROUTER_SELECTORS.selectCurrentRoute,
        CONTROL_SCHEME_SELECTORS.selectEntities,
        HUBS_SELECTORS.selectEntities,
        (
            route: ActivatedRouteSnapshot | undefined,
            controlSchemes: Dictionary<ControlSchemeModel>,
            hubEntities: Dictionary<HubModel>
        ): PortConfigEditViewModel | null => {
            const controlSchemeId = route?.params?.['schemeId'] ?? null;
            const hubId: string | null = route?.params?.['hubId'] ?? null;
            const portId: string | null = route?.params?.['portId'] ?? null;

            if (!controlSchemeId || !hubId || !portId) {
                return null;
            }
            const scheme = controlSchemes[controlSchemeId];
            const hub = hubEntities[hubId];
            if (!hub) {
                return null;
            }
            const portConfig = scheme?.portConfigs.find((pc) => pc.hubId === hubId && pc.portId === parseInt(portId));

            if (!portConfig) {
                return null;
            }

            return {
                controlSchemeId,
                hubId,
                hubName: hub.name,
                portId: parseInt(portId),
                accelerationTimeMs: portConfig.accelerationTimeMs,
                decelerationTimeMs: portConfig.decelerationTimeMs
            };
        }
    )
} as const;
