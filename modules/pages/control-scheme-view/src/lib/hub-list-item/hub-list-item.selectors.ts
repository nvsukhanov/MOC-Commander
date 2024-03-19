/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS, HUBS_SELECTORS, HUB_RUNTIME_DATA_SELECTORS } from '@app/store';

export const HUB_LIST_ITEM_SELECTORS = {
    selectIsHubKnown: (hubId: string) => createSelector(
        HUBS_SELECTORS.selectHub(hubId),
        (hub): boolean => !!hub
    ),
    selectHubName: (hubId: string) => createSelector(
        HUBS_SELECTORS.selectHub(hubId),
        (hub): string => hub?.name ?? ''
    ),
    selectBatteryLevel: (hubId: string) => HUB_RUNTIME_DATA_SELECTORS.selectHubBatteryLevel(hubId),
    selectRssi: (hubId: string) => HUB_RUNTIME_DATA_SELECTORS.selectHubRssi(hubId),
    selectButtonState: (hubId: string) => HUB_RUNTIME_DATA_SELECTORS.selectButtonState(hubId),
    selectHasCommunication: (hubId: string) => HUB_RUNTIME_DATA_SELECTORS.selectHasCommunication(hubId),
    selectIsConnected: (hubId: string) => HUB_RUNTIME_DATA_SELECTORS.selectIsHubConnected(hubId),
    selectControlSchemeHubPorts: (controlSchemeName: string, hubId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return [];
            }
            const uniquePorts = new Set<number>();
            for (const binding of scheme.bindings) {
                if (binding.hubId === hubId) {
                    uniquePorts.add(binding.portId);
                }
            }
            return Array.from(uniquePorts);
        }
    )
} as const;
