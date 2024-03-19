import { HubType } from 'rxpoweredup';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HUBS_ACTIONS = createActionGroup({
    source: 'Hubs',
    events: {
        startDiscovery: emptyProps(),
        connected: props<{ hubId: string; name: string }>(),
        disconnected: props<{ hubId: string; name: string }>(),
        deviceConnectFailed: props<{ error: Error }>(),
        discoveryCancelled: emptyProps(),
        userRequestedHubDisconnection: props<{ hubId: string }>(),
        hubTypeReceived: props<{ hubId: string; hubType: HubType }>(),
        requestSetHubName: props<{ hubId: string; name: string }>(),
        hubNameSet: props<{ hubId: string; name: string }>(),
        hubNameSetError: props<{ hubId: string }>(),
        forgetHub: props<{ hubId: string }>(),

        requestPortPosition: props<{ hubId: string; portId: number }>(),
        portPositionRead: props<{ hubId: string; portId: number; position: number }>(),
        portPositionReadFailed: props<{ hubId: string; portId: number; error: Error }>(),

        requestPortAbsolutePosition: props<{ hubId: string; portId: number }>(),
        portAbsolutePositionRead: props<{ hubId: string; portId: number; position: number }>(),
        portAbsolutePositionReadFailed: props<{ hubId: string; portId: number; error: Error }>(),
        setPortPosition: props<{ hubId: string; portId: number; position: number }>(),
    }
});
