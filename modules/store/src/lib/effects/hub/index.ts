import { FunctionalEffect } from '@ngrx/effects';

import { DISCOVER_HUB_EFFECT } from './discover-hub.effect';
import { REQUEST_HUB_TYPE_ON_CONNECT } from './request-hub-type-on-connect.effect';
import { POLL_BATTERY_LEVEL_ON_CONNECT } from './poll-battery-level-on-connect.effect';
import { POLL_RSSI_LEVEL_ON_CONNECT } from './poll-rssi-level-on-connect.effect';
import { SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT } from './subscribe-to-button-state-on-connect';
import { TRACK_HUB_DISCONNECTS_EFFECT } from './track-hub-disconnects.effect';
import { DISCONNECT_HUB_ON_USER_REQUEST } from './disconnect-hub-on-user-request.effect';
import { REQUEST_SET_HUB_NAME_EFFECT } from './request-set-hub-name.effect';
import { REQUEST_PORT_POSITION_EFFECT } from './request-port-position.effect';
import { REQUEST_PORT_ABSOLUTE_POSITION_EFFECT } from './request-port-absolute-position.effect';
import { SET_MOTOR_POSITION_EFFECT } from './set-motor-position.effect';
import { REQUEST_HUB_FIRMWARE_VERSION_ON_CONNECT } from './request-hub-firmware-version-on-connect';
import { REQUEST_HUB_HARDWARE_VERSION_ON_CONNECT } from './request-hub-hardware-version-on-connect';
import { NOTIFY_ON_HUB_CONNECT_FAILED_EFFECT } from './notify-on-hub-connect-failed.effect';
import { NOTIFY_ON_HUB_CONNECTED_EFFECT } from './notify-on-hub-connected.effect';
import { NOTIFY_ON_HUB_DISCONNECTED_EFFECT } from './notify-on-hub-disconnected.effect';
import { NOTIFY_ON_HUB_SET_NAME_ERROR_EFFECT } from './notify-on-hub-name-set-error.effect';

export const HUB_EFFECTS: { [k in string]: FunctionalEffect } = {
    discoverHub: DISCOVER_HUB_EFFECT,
    requestHubTypeOnConnect: REQUEST_HUB_TYPE_ON_CONNECT,
    requestHubFirmwareVersionOnConnect: REQUEST_HUB_FIRMWARE_VERSION_ON_CONNECT,
    requestHubHardwareVersionOnConnect: REQUEST_HUB_HARDWARE_VERSION_ON_CONNECT,
    pollBatteryLevelOnConnect: POLL_BATTERY_LEVEL_ON_CONNECT,
    pollRssiLevelOnConnect: POLL_RSSI_LEVEL_ON_CONNECT,
    subscribeToButtonStateOnConnect: SUBSCRIBE_TO_BUTTON_STATE_ON_CONNECT,
    trackHubDisconnects: TRACK_HUB_DISCONNECTS_EFFECT,
    disconnectHubOnUserRequest: DISCONNECT_HUB_ON_USER_REQUEST,
    requestSetHubName: REQUEST_SET_HUB_NAME_EFFECT,
    requestPortPosition: REQUEST_PORT_POSITION_EFFECT,
    requestPortAbsolutePosition: REQUEST_PORT_ABSOLUTE_POSITION_EFFECT,
    setMotorPosition: SET_MOTOR_POSITION_EFFECT,
    notifyOnHubConnectFailed: NOTIFY_ON_HUB_CONNECT_FAILED_EFFECT,
    notifyOnHubConnected: NOTIFY_ON_HUB_CONNECTED_EFFECT,
    notifyOnHubDisconnected: NOTIFY_ON_HUB_DISCONNECTED_EFFECT,
    notifyOnHubSetNameError: NOTIFY_ON_HUB_SET_NAME_ERROR_EFFECT
} as const;
