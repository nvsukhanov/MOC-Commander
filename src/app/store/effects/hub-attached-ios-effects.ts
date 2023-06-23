import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIOAttachVirtualInboundMessage, AttachedIoAttachInboundMessage } from '@nvsukhanov/rxpoweredup';

import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';
import { PortType } from '../i-state';

@Injectable()
export class HubAttachedIOsEffects {
    public readonly listenAttachedPhysicalIOs$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach({ eventTypes: [ AttachIoEvent.Attached ] }).pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    map((r) => {
                        const attachMessage = r as AttachedIoAttachInboundMessage;
                        return HUB_ATTACHED_IOS_ACTIONS.ioConnected({
                            io: {
                                portType: PortType.Physical,
                                hubId: action.hubId,
                                portId: attachMessage.portId,
                                hardwareRevision: attachMessage.hardwareRevision,
                                softwareRevision: attachMessage.softwareRevision,
                                ioType: attachMessage.ioTypeId,
                            }
                        });
                    })
                );
            })
        );
    });

    public readonly listenAttachedVirtualIOs$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach({ eventTypes: [ AttachIoEvent.AttachedVirtual ] }).pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    map((r) => {
                        const attachMessage = r as AttachedIOAttachVirtualInboundMessage;
                        return HUB_ATTACHED_IOS_ACTIONS.ioConnected({
                            io: {
                                portType: PortType.Virtual,
                                hubId: action.hubId,
                                portId: attachMessage.portId,
                                ioType: attachMessage.ioTypeId,
                                portIdA: attachMessage.portIdA,
                                portIdB: attachMessage.portIdB,
                            }
                        });
                    })
                );
            }),
        );
    });

    public readonly listenDetachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoDetach().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).disconnected),
                    map((ioDetachEvent) => HUB_ATTACHED_IOS_ACTIONS.ioDisconnected({ hubId: action.hubId, portId: ioDetachEvent.portId }))
                );
            })
        );
    });

    public readonly createVirtualPort$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.createVirtualPort),
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
            ofType(HUB_ATTACHED_IOS_ACTIONS.deleteVirtualPort),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.deleteVirtualPort(
                    action.portId
                );
            })
        );
    }, { dispatch: false });

    constructor(
        private readonly actions: Actions,
        private readonly hubStorage: HubStorageService,
    ) {
    }
}
