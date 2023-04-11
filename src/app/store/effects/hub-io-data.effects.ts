import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HUB_IO_DATA_ACTIONS, HUBS_ACTIONS } from '../actions';
import { filter, map, mergeMap, of, switchMap, takeUntil, zip } from 'rxjs';
import { HubStorageService } from '../hub-storage.service';
import { HUB_IO_DATA_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class HubIoDataEffects {
    public readonly subscribeToPortValues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_IO_DATA_ACTIONS.subscribeToPortValues),
            mergeMap(async (action) => {
                await this.lpuHubStorageService.getHub(action.hubId).ports.setPortInputFormat(action.portId, action.modeId, true);
                return HUB_IO_DATA_ACTIONS.subscribeToPortValuesSuccess({
                    hubId: action.hubId,
                    portId: action.portId,
                    modeId: action.modeId
                });
            })
        );
    });

    public readonly unsubscribeFromPortValues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_IO_DATA_ACTIONS.unsubscribeFromPortValues),
            switchMap((action) => zip([
                of(action),
                this.store.select(HUB_IO_DATA_SELECTORS.selectPortIOData(action.hubId, action.portId))
            ])),
            filter(([ , b ]) => !!b),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mergeMap(([ action, data ]) => this.lpuHubStorageService.getHub(action.hubId).ports.setPortInputFormat(action.portId, data!.modeId, false))
        );
    }, { dispatch: false }); // TODO: should clean up the store

    public listenPortValues$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_IO_DATA_ACTIONS.subscribeToPortValuesSuccess),
            mergeMap((action) => {
                return this.lpuHubStorageService.getHub(action.hubId).ports.getPortValueUpdates$(action.portId).pipe(
                    takeUntil(this.actions$.pipe(ofType(HUB_IO_DATA_ACTIONS.unsubscribeFromPortValues, HUBS_ACTIONS.disconnected))),
                    filter((d) => d.portId === action.portId),
                    map((d) => HUB_IO_DATA_ACTIONS.updatePortValue({ hubId: action.hubId, portId: action.portId, value: [ ...d.payload ] }))
                );
            })
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: HubStorageService,
        private readonly store: Store
    ) {
    }
}
