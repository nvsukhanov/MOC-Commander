import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HUB_IO_DATA_ACTIONS, HUBS_ACTIONS } from '../actions';
import { Subscription, tap } from 'rxjs';
import { HubStorageService } from '../hub-storage.service';
import { HUB_IO_DATA_SELECTORS } from '../selectors';
import { IState } from '../i-state';
import { Store } from '@ngrx/store';

@Injectable()
export class HubIoDataEffects {
    public readonly subscribeToPortValues$ = createEffect(() => this.actions$.pipe(
        ofType(HUB_IO_DATA_ACTIONS.subscribeToPortValues),
        tap(async (action) => {
            await this.lpuHubStorageService.getHub(action.hubId).ports.setPortInputFormat(action.portId, action.modeId, true);
            this.store.dispatch(HUB_IO_DATA_ACTIONS.subscribeToPortValuesSuccess({
                hubId: action.hubId,
                portId: action.portId,
                modeId: action.modeId
            }));
        })
    ), { dispatch: false });

    public readonly unsubscribeFromPortValues$ = createEffect(() => this.actions$.pipe(
        ofType(HUB_IO_DATA_ACTIONS.unsubscribeFromPortValues),
        tap((action) => {
            this.store.select(HUB_IO_DATA_SELECTORS.selectPortIOData(action.hubId, action.portId)).subscribe((d) => {
                if (!d) {
                    return;
                }
                this.lpuHubStorageService.getHub(action.hubId).ports.setPortInputFormat(action.portId, d.modeId, false);
            });
        })
    ), { dispatch: false });

    public readonly trackPortValueUpdates$ = createEffect(() => this.actions$.pipe(
        ofType(HUB_IO_DATA_ACTIONS.subscribeToPortValuesSuccess, HUB_IO_DATA_ACTIONS.unsubscribeFromPortValues, HUBS_ACTIONS.disconnected),
        tap((action) => {
            if (action.type === HUBS_ACTIONS.disconnected.type) {
                const hubSubscriptions = this.hubPortValueTrackSubscriptions.get(action.hubId);
                if (!hubSubscriptions) {
                    return;
                }
                [ ...hubSubscriptions.values() ].forEach((s) => s.unsubscribe());
                this.hubPortValueTrackSubscriptions.delete(action.hubId);
                return;
            }
            const subscriptionKey = action.portId;
            if (action.type === HUB_IO_DATA_ACTIONS.subscribeToPortValuesSuccess.type) {
                const subscription = this.store.select(HUB_IO_DATA_SELECTORS.selectPortIOData(action.hubId, action.portId)).subscribe((d) => {
                    if (!d) {
                        return;
                    }
                    this.store.dispatch(HUB_IO_DATA_ACTIONS.updatePortValue({ hubId: action.hubId, portId: action.portId, value: d.values }));
                });
                let hubPortValueSubscriptions = this.hubPortValueTrackSubscriptions.get(action.hubId);
                if (!hubPortValueSubscriptions) {
                    hubPortValueSubscriptions = new Map<number, Subscription>();
                    this.hubPortValueTrackSubscriptions.set(action.hubId, hubPortValueSubscriptions);
                }
                hubPortValueSubscriptions.set(subscriptionKey, subscription);
            } else {
                this.hubPortValueTrackSubscriptions.get(action.hubId)?.get(subscriptionKey)?.unsubscribe();
                this.hubPortValueTrackSubscriptions.get(action.hubId)?.delete(subscriptionKey);
            }
        })
    ), { dispatch: false });

    private readonly hubPortValueTrackSubscriptions = new Map<string, Map<number, Subscription>>();

    constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: HubStorageService,
        private readonly store: Store<IState>
    ) {
    }
}
