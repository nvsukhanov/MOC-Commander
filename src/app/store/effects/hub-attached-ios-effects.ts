import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIoAttachInboundMessage } from '@nvsukhanov/rxpoweredup';
import { Store } from '@ngrx/store';

import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';
import { HUB_ATTACHED_IO_SELECTORS } from '../selectors';

@Injectable()
export class HubAttachedIOsEffects {
    public readonly listenAttachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach({ eventTypes: [ AttachIoEvent.Attached ] }).pipe(
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
                    concatLatestFrom((ioDetachEvent) =>
                        this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOAtPort({ hubId: action.hubId, portId: ioDetachEvent.portId }))
                    ),
                    filter(([ , io ]) => !!io),
                    map(([ ioDetachEvent ]) => HUB_ATTACHED_IOS_ACTIONS.unregisterIO({ hubId: action.hubId, portId: ioDetachEvent.portId }))
                );
            })
        );
    });

    constructor(
        private readonly actions: Actions,
        private readonly store: Store,
        private readonly hubStorage: HubStorageService,
    ) {
    }
}
