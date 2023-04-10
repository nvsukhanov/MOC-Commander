import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HUB_ATTACHED_IOS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { Subscription, tap } from 'rxjs';
import { AttachIoEvent } from '../../lego-hub';
import { HubStorageService } from '../hub-storage.service';
import { IState } from '../i-state';
import { Store } from '@ngrx/store';

@Injectable()
export class HubAttachedIOsEffects {
    public readAttachDetachIoEvents$ = createEffect(() => this.actions.pipe(
        ofType(HUBS_ACTIONS.connected, HUBS_ACTIONS.disconnected),
        tap((action) => {
            if (action.type === HUBS_ACTIONS.connected.type) {
                const subscription = this.lpuHubStorageService.getHub(action.hubId).ports.attachedIoReplies$.subscribe((r) => {
                    if (r.event === AttachIoEvent.Attached) {
                        this.store.dispatch(HUB_ATTACHED_IOS_ACTIONS.registerio({
                            portId: r.portId,
                            ioType: r.ioTypeId,
                            hardwareRevision: r.hardwareRevision,
                            softwareRevision: r.softwareRevision,
                            hubId: action.hubId
                        }));
                    } else if (r.event === AttachIoEvent.Detached) {
                        this.store.dispatch(HUB_ATTACHED_IOS_ACTIONS.unregisterio({ hubId: action.hubId, portId: r.portId }));
                    }
                });
                this.hubAttachedIoListeners.set(action.hubId, subscription);
            } else {
                this.hubAttachedIoListeners.get(action.hubId)?.unsubscribe();
                this.hubAttachedIoListeners.delete(action.hubId);
            }
        })
    ), { dispatch: false });

    private readonly hubAttachedIoListeners = new Map<string, Subscription>();

    constructor(
        private readonly actions: Actions,
        private readonly lpuHubStorageService: HubStorageService,
        private readonly store: Store<IState>
    ) {
    }
}
