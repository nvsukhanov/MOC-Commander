import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HUB_ATTACHED_IOS_ACTIONS, HUBS_ACTIONS } from '../actions';
import { map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent } from '@nvsukhanov/poweredup-api';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubAttachedIOsEffects {
    public readonly listenAttachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).beforeDisconnect),
                    map((r) => {
                        if (r.event === AttachIoEvent.Attached) {
                            return HUB_ATTACHED_IOS_ACTIONS.registerio({
                                portId: r.portId,
                                ioType: r.ioTypeId,
                                hardwareRevision: r.hardwareRevision,
                                softwareRevision: r.softwareRevision,
                                hubId: action.hubId
                            });
                        }
                        return HUB_ATTACHED_IOS_ACTIONS.unregisterio({ hubId: action.hubId, portId: r.portId });
                    })
                );
            })
        );
    });

    constructor(
        private readonly actions: Actions,
        private readonly hubStorage: HubStorageService,
    ) {
    }
}
