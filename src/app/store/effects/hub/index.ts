import { FunctionalEffect } from '@ngrx/effects';

import { DISCOVER_HUB_EFFECT } from './discover-hub.effect';
import { REQUEST_HUB_TYPE_ON_CONNECT } from './request-hub-type-on-connect.effect';
import { POLL_BATTERY_LEVEL_ON_CONNECT } from './poll-battery-level-on-connect.effect';
import { POLL_RSSI_LEVEL_ON_CONNECT } from './poll-rssi-level-on-connect.effect';
import { SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT } from './subscribe-to-button-state-on-connect';
import { TRACK_HUB_DISCONNECTS_EFFECT } from './track-hub-disconnects.effect';
import { DISCONNECT_HUB_ON_USER_REQUEST } from './disconnect-hub-on-user-request.effect';
import { SET_HUB_NAME_EFFECT } from './set-hub-name.effect';
import { NAVIGATE_TO_HUB_VIEW_PAGE_ON_SAVE } from './navigate-to-hub-view-page-on-save.effect';
import { REQUEST_PORT_POSITION_EFFECT } from './request-port-position.effect';
import { REQUEST_PORT_ABSOLUTE_POSITION_EFFECT } from './request-port-absolute-position.effect';

export const HUB_EFFECTS: { [k in string]: FunctionalEffect } = {
    discoverHub: DISCOVER_HUB_EFFECT,
    requestHubTypeOnConnect: REQUEST_HUB_TYPE_ON_CONNECT,
    pollBatteryLevelOnConnect: POLL_BATTERY_LEVEL_ON_CONNECT,
    pollRssiLevelOnConnect: POLL_RSSI_LEVEL_ON_CONNECT,
    subscribeToButtonStateOnConnect: SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT,
    trackHubDisconnects: TRACK_HUB_DISCONNECTS_EFFECT,
    disconnectHubOnUserRequest: DISCONNECT_HUB_ON_USER_REQUEST,
    setHubName: SET_HUB_NAME_EFFECT,
    navigateToHubViewPageOnSave: NAVIGATE_TO_HUB_VIEW_PAGE_ON_SAVE,
    requestPortPosition: REQUEST_PORT_POSITION_EFFECT,
    requestPortAbsolutePosition: REQUEST_PORT_ABSOLUTE_POSITION_EFFECT,
} as const;
