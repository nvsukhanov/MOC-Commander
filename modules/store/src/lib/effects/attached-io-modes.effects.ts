import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, takeUntil } from 'rxjs';
import { PortModeInboundMessage } from 'rxpoweredup';
import { concatLatestFrom } from '@ngrx/operators';

import { ATTACHED_IOS_ACTIONS, ATTACHED_IO_MODES_ACTIONS } from '../actions';
import { ATTACHED_IO_MODES_SELECTORS } from '../selectors';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class AttachedIoModesEffects {
  public loadHubIoOutputModesIfCacheIsEmpty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ATTACHED_IOS_ACTIONS.ioConnected),
      concatLatestFrom((action) => this.store.select(ATTACHED_IO_MODES_SELECTORS.hasCachedIoPortModes(action.io))),
      filter(([, hasCached]) => !hasCached),
      mergeMap(([action]) =>
        this.hubStorage
          .get(action.io.hubId)
          .ports.getPortModes(action.io.portId)
          .pipe(
            takeUntil(this.hubStorage.get(action.io.hubId).disconnected),
            takeUntil(this.hubStorage.get(action.io.hubId).ports.onIoDetach({ ports: [action.io.portId] })),
            map((modesData: PortModeInboundMessage) => ({ action, modesData })),
          ),
      ),
      map(({ action, modesData }) =>
        ATTACHED_IO_MODES_ACTIONS.portModesReceived({
          io: action.io,
          portInputModes: modesData.inputModes,
          portOutputModes: modesData.outputModes,
          synchronizable: modesData.capabilities.logicalSynchronizable,
        }),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly hubStorage: HubStorageService,
  ) {}
}
