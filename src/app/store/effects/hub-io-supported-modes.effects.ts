import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, takeUntil } from 'rxjs';
import { PortModeInboundMessage } from '@nvsukhanov/rxpoweredup';

import { HUB_ATTACHED_IOS_ACTIONS, HUB_IO_SUPPORTED_MODES } from '../actions';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from '../selectors';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubIoSupportedModesEffects {
    public loadHubIoOutputModesIfCacheIsEmpty$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.ioConnected),
            concatLatestFrom((action) => this.store.select(HUB_IO_SUPPORTED_MODES_SELECTORS.hasCachedIoPortModes(action.io))),
            filter(([ , hasCached ]) => !hasCached),
            mergeMap(([ action ]) => this.hubStorage.get(action.io.hubId).ports.getPortModes(action.io.portId).pipe(
                takeUntil(this.hubStorage.get(action.io.hubId).disconnected),
                takeUntil(this.hubStorage.get(action.io.hubId).ports.onIoDetach({ ports: [ action.io.portId ] })),
                map((modesData: PortModeInboundMessage) => ({ action, modesData })),
            )),
            map(({ action, modesData }) => HUB_IO_SUPPORTED_MODES.portModesReceived({
                io: action.io,
                portInputModes: modesData.inputModes,
                portOutputModes: modesData.outputModes,
                synchronizable: modesData.capabilities.logicalSynchronizable
            }))
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store,
        private readonly hubStorage: HubStorageService
    ) {
    }
}
