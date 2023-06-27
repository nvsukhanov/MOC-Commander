import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { concat, map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIOAttachVirtualInboundMessage, AttachedIoAttachInboundMessage } from '@nvsukhanov/rxpoweredup';
import { Store } from '@ngrx/store';

import { HUBS_ACTIONS, HUB_ATTACHED_IOS_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';
import { PortType } from '../i-state';
import { HUB_ATTACHED_IO_SELECTORS, HUB_KEEP_VIRTUAL_PORTS_SELECTORS } from '../selectors';

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
                    concatLatestFrom((attachData) => {
                        const virtualAttachData = attachData as AttachedIOAttachVirtualInboundMessage;
                        return this.store.select(
                            HUB_KEEP_VIRTUAL_PORTS_SELECTORS.shouldKeepVirtualPort({
                                hubId: action.hubId,
                                portIdA: virtualAttachData.portIdA,
                                portIdB: virtualAttachData.portIdB,
                            })
                        );
                    }),
                    map(([ attachData, shouldKeep ]) => {
                        const virtualAttachData = attachData as AttachedIOAttachVirtualInboundMessage;
                        if (!shouldKeep) {
                            return HUB_ATTACHED_IOS_ACTIONS.deleteVirtualPort({
                                hubId: action.hubId,
                                portIdA: virtualAttachData.portIdA,
                                portIdB: virtualAttachData.portIdB,
                                portId: virtualAttachData.portId,
                            });
                        }
                        const attachMessage = attachData as AttachedIOAttachVirtualInboundMessage;
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
                    }),
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
                ).pipe(
                    map((r) => HUB_ATTACHED_IOS_ACTIONS.virtualPortCreated({
                        hubId: action.hubId,
                        portId: r.portId,
                        portIdA: r.portIdA,
                        portIdB: r.portIdB,
                        ioType: r.ioTypeId
                    }))
                );
            }),
        );
    });

    public readonly deleteVirtualPort$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.deleteVirtualPort),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.deleteVirtualPort(
                    action.portId
                ).pipe(
                    map((r) => HUB_ATTACHED_IOS_ACTIONS.virtualPortDeleted({
                        hubId: action.hubId,
                        portId: r.portId
                    }))
                );
            })
        );
    });

    public readonly deleteAllVirtualPorts$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.deleteAllVirtualPorts),
            concatLatestFrom((action) => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectHubVirtualPorts(action.hubId))),
            mergeMap(([ action, virtualPorts ]) => {
                const hub = this.hubStorage.get(action.hubId);
                return concat(
                    ...virtualPorts.map((port) => hub.ports.deleteVirtualPort(port.portId).pipe(
                        map((r) => HUB_ATTACHED_IOS_ACTIONS.virtualPortDeleted({
                            hubId: action.hubId,
                            portId: r.portId
                        }))
                    ))
                );
            })
        );
    });

    constructor(
        private readonly actions: Actions,
        private readonly hubStorage: HubStorageService,
        private readonly store: Store
    ) {
    }
}
