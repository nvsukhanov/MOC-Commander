import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HUB_ATTACHED_IOS_ACTIONS, HUB_PORT_MODE_INFO_ACTIONS, HUBS_ACTIONS } from '../actions';
import { bufferCount, concatWith, filter, map, mergeMap, Observable, take, takeUntil } from 'rxjs';
import { AttachedIoAttachInboundMessage, AttachIoEvent, PortModeName } from '@nvsukhanov/rxpoweredup';
import { HubStorageService } from '../hub-storage.service';
import { Store } from '@ngrx/store';
import { HUB_IO_SUPPORTED_MODES_SELECTORS, HUB_PORT_MODE_INFO_SELECTORS } from '../selectors';

@Injectable()
export class HubAttachedIOsEffects {
    public readonly listenAttachedIOsReplies$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUBS_ACTIONS.connected),
            mergeMap((action) => {
                return this.hubStorage.get(action.hubId).ports.onIoAttach().pipe(
                    takeUntil(this.hubStorage.get(action.hubId).beforeDisconnect),
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
                    takeUntil(this.hubStorage.get(action.hubId).beforeDisconnect),
                    map((r) => HUB_ATTACHED_IOS_ACTIONS.unregisterIO({ hubId: action.hubId, portId: r.portId }))
                );
            })
        );
    });

    public readonly getMotorEncoderOffset$ = createEffect(() => {
        return this.actions.pipe(
            ofType(HUB_ATTACHED_IOS_ACTIONS.registerIO),
            mergeMap((action) => this.getModeIdForModeName(
                action.hardwareRevision,
                action.softwareRevision,
                action.ioType,
                PortModeName.position
            ).pipe(
                concatWith(this.getModeIdForModeName(
                    action.hardwareRevision,
                    action.softwareRevision,
                    action.ioType,
                    PortModeName.absolutePosition
                )),
                bufferCount(2),
                map(([ positionModeId, absolutePositionModeId ]) => ({ positionModeId, absolutePositionModeId, action })),
            )),
            filter((d) => d.absolutePositionModeId !== null && d.positionModeId !== null),
            mergeMap(({ positionModeId, absolutePositionModeId, action }) => {
                return this.hubStorage.get(action.hubId).motors.getPosition(action.portId, positionModeId!).pipe(
                    concatWith(this.hubStorage.get(action.hubId).motors.getAbsolutePosition(action.portId, absolutePositionModeId!)),
                    bufferCount(2),
                    map(([ position, absolutePosition ]) => absolutePosition - position),
                    map((offset) => HUB_ATTACHED_IOS_ACTIONS.motorEncoderOffsetReceived({
                        hubId: action.hubId,
                        portId: action.portId,
                        offset
                    }))
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

    private getModeIdForModeName(
        hardwareRevision: string,
        softwareRevision: string,
        ioType: number,
        portModeName: PortModeName
    ): Observable<number | null> {
        return this.store.select(HUB_IO_SUPPORTED_MODES_SELECTORS.hasCachedIOPortModes(
            hardwareRevision,
            softwareRevision,
            ioType
        )).pipe(
            take(1),
            concatWith(this.store.select(HUB_PORT_MODE_INFO_SELECTORS.hasCachedPortModeInfo(hardwareRevision, softwareRevision, ioType))),
            bufferCount(2),
            map(([ hasCachedIOPortModes, hasCachePortModeInfo ]) => hasCachedIOPortModes && hasCachePortModeInfo),
            mergeMap((hasCache) => {
                if (hasCache) {
                    return this.store.select(HUB_PORT_MODE_INFO_SELECTORS.selectModeIdForInputModeName(
                        hardwareRevision,
                        softwareRevision,
                        ioType,
                        portModeName
                    ));
                } else {
                    return this.actions.pipe(
                        ofType(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData),
                        map((d) => d.dataSets.find((dataSet) => dataSet.name === portModeName
                            && dataSet.hardwareRevision === hardwareRevision
                            && dataSet.softwareRevision === softwareRevision
                            && dataSet.ioType === ioType
                        )),
                        map((positionMode) => positionMode?.modeId || null),
                    );
                }
            }),
            take(1)
        );
    }
}
