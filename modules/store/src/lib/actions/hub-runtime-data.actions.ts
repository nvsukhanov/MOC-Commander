import { createActionGroup, props } from '@ngrx/store';

export const HUB_RUNTIME_DATA_ACTIONS = createActionGroup({
  source: 'Hub runtime data',
  events: {
    batteryLevelSubscribe: props<{ hubId: string }>(),
    batteryLevelReceived: props<{ hubId: string; batteryLevel: null | number }>(),
    batteryLevelUnsubscribe: props<{ hubId: string }>(),
    rssiLevelSubscribe: props<{ hubId: string }>(),
    rssiLevelReceived: props<{ hubId: string; rssi: null | number }>(),
    rssiLevelUnsubscribe: props<{ hubId: string }>(),
    buttonStateSubscribe: props<{ hubId: string }>(),
    buttonStateReceived: props<{ hubId: string; isButtonPressed: boolean }>(),
    buttonStateUnsubscribe: props<{ hubId: string }>(),
    setHasCommunication: props<{ hubId: string; hasCommunication: boolean }>(),
    setHardwareVersion: props<{ hubId: string; hardwareVersion: string }>(),
    setFirmwareVersion: props<{ hubId: string; firmwareVersion: string }>(),
  },
});
