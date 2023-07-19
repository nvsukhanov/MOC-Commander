import { createSelector } from '@ngrx/store';
import {
    BLUETOOTH_AVAILABILITY_SELECTORS,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROL_SCHEME_V2_SELECTORS,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS
} from '@app/store';

import { NavMenuViewModel } from './nav-menu-view-model';

export const NAV_MENU_SELECTORS = {
    selectNavMenuViewModel: createSelector(
        CONTROLLER_CONNECTION_SELECTORS.selectTotal,
        HUB_STATS_SELECTORS.selectTotal,
        CONTROL_SCHEME_V2_SELECTORS.selectTotal,
        BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable,
        HUBS_SELECTORS.selectIsDiscovering,
        (
            connectedControllersCount,
            connectedHubCount,
            controlSchemesCount,
            isBluetoothAvailable,
            isDiscoveryBusy
        ): NavMenuViewModel => ({
            connectedControllersCount,
            connectedHubCount,
            controlSchemesCount,
            isBluetoothAvailable,
            isDiscoveryBusy
        })
    )
} as const;
