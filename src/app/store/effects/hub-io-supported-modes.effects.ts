import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, takeUntil } from 'rxjs';

import { HUB_ATTACHED_IOS_ACTIONS, HUB_IO_SUPPORTED_MODES } from '../actions';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from '../selectors';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubIOSupportedModesEffects {
    public loadHubIOOutputModesIfCacheIsEmpty$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.registerIO),
            concatLatestFrom((action) => this.store.select(HUB_IO_SUPPORTED_MODES_SELECTORS.hasCachedIOPortModes(
                action.hardwareRevision,
                action.softwareRevision,
                action.ioType
            ))),
            filter(([ , hasCached ]) => !hasCached),
            mergeMap(([ action ]) => this.hubStorage.get(action.hubId).ports.getPortModes(action.portId).pipe(
                takeUntil(this.hubStorage.get(action.hubId).disconnected),
                takeUntil(this.hubStorage.get(action.hubId).ports.onIoDetach(action.portId)),
                map((modesData) => ({ action, modesData })),
            )),
            map(({ action, modesData }) => HUB_IO_SUPPORTED_MODES.portModesReceived({
                hardwareRevision: action.hardwareRevision,
                softwareRevision: action.softwareRevision,
                ioType: action.ioType,
                portInputModes: modesData.inputModes,
                portOutputModes: modesData.outputModes
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
