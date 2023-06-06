import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIoAttachInboundMessage } from '@nvsukhanov/rxpoweredup';

import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubAttachedIOsEffects {
    public readonly listenAttachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    filter((r) => r.event === AttachIoEvent.Attached),
                    map((r) => {
                        const attachMessage = r as AttachedIoAttachInboundMessage;
                        return HUB_ATTACHED_IOS_ACTIONS.registerIO({
                            portId: attachMessage.portId,
                            ioType: attachMessage.ioTypeId,
                            hardwareRevision: attachMessage.hardwareRevision,
                            softwareRevision: attachMessage.softwareRevision,
                            hubId: action.hubId
                        });
                    })
                );
            })
        );
    });

    public readonly listenDetachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoDetach().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    map((r) => HUB_ATTACHED_IOS_ACTIONS.unregisterIO({ hubId: action.hubId, portId: r.portId }))
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
