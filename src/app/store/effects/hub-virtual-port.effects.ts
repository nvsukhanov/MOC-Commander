import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIOAttachVirtualInboundMessage } from '@nvsukhanov/rxpoweredup';
import { Store } from '@ngrx/store';

import { HubStorageService } from '../hub-storage.service';
import { HUBS_ACTIONS, HUB_VIRTUAL_PORT_ACTIONS } from '../actions';
import { HUB_VIRTUAL_PORT_SELECTORS } from '../selectors';

@Injectable()
export class HubVirtualPortEffects {
    public readonly listenVirtualPortAttach$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((hubConfig) => {
                const hub = this.hubStorage.get(hubConfig.hubId);
                return hub.ports.onIoAttach({ eventTypes: [ AttachIoEvent.AttachedVirtual ] }).pipe(
                    takeUntil(hub.disconnected),
                    map((e) => {
                        const narrowedEvent = e as AttachedIOAttachVirtualInboundMessage;
                        return HUB_VIRTUAL_PORT_ACTIONS.virtualPortCreated({
                            hubId: hubConfig.hubId,
                            portId: narrowedEvent.portId,
                            portIdA: narrowedEvent.portIdA,
                            portIdB: narrowedEvent.portIdB,
                            ioType: narrowedEvent.ioTypeId
                        });
                    })
                );
            })
        );
    });

    public readonly listenVirtualPortDetach$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((hubConfig) => {
                const hub = this.hubStorage.get(hubConfig.hubId);
                return hub.ports.onIoDetach().pipe(
                    takeUntil(this.hubStorage.get(hubConfig.hubId).disconnected),
                    concatLatestFrom((ioDetachEvent) =>
                        this.store.select(HUB_VIRTUAL_PORT_SELECTORS.selectByPort({ hubId: hubConfig.hubId, portId: ioDetachEvent.portId }))
                    ),
                    filter(([ , virtualPort ]) => !!virtualPort),
                    map(([ ioDetachEvent ]) => HUB_VIRTUAL_PORT_ACTIONS.virtualPortDeleted({
                        hubId: hubConfig.hubId,
                        portId: ioDetachEvent.portId
                    }))
                );
            })
        );
    });

    public readonly createVirtualPort$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_VIRTUAL_PORT_ACTIONS.createVirtualPort),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.createVirtualPort(
                    action.portIdA,
                    action.portIdB
                );
            })
        );
    }, { dispatch: false });

    public readonly deleteVirtualPort$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_VIRTUAL_PORT_ACTIONS.deleteVirtualPort),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.deleteVirtualPort(
                    action.portId
                );
            })
        );
    }, { dispatch: false });

    constructor(
        private readonly actions: Actions,
        private readonly store: Store,
        private readonly hubStorage: HubStorageService
    ) {
    }
}
