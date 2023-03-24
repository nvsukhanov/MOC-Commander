import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ACTIONS_CONFIGURE_HUB = createActionGroup({
    source: 'ACTIONS_CONFIGURE_HUB',
    events: {
        'start discovery': emptyProps(),
        'device connected': emptyProps(),
        'device disconnected': emptyProps(),
        'device connect failed': props<{ error: Error }>(),
        'user requested hub disconnection': emptyProps()
    }
});

export const ACTION_CONFIGURE_HUB_TERMINATION = [
    ACTIONS_CONFIGURE_HUB.deviceDisconnected,
    ACTIONS_CONFIGURE_HUB.deviceConnectFailed,
];
