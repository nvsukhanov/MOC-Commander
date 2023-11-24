import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, bufferCount, concatWith, filter, map, mergeMap, take } from 'rxjs';
import { PortModeName, ValueTransformers } from 'rxpoweredup';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS } from '../selectors';
import { HubStorageService } from '../hub-storage.service';
import { ATTACHED_IOS_ACTIONS, ATTACHED_IO_PROPS_ACTIONS } from '../actions';
import { AttachedIoModel } from '../models';

@Injectable()
export class HubAttachedIosStateEffects {
    public readonly getMotorEncoderOffset$ = createEffect(() => {
        return this.actions.pipe(
            ofType(ATTACHED_IOS_ACTIONS.ioConnected),
            mergeMap((action) => this.getModeIdForModeName(
                action.io,
                PortModeName.position
            ).pipe(
                concatWith(this.getModeIdForModeName(
                    action.io,
                    PortModeName.absolutePosition
                )),
                bufferCount(2),
                map(([ positionModeId, absolutePositionModeId ]) => ({ positionModeId, absolutePositionModeId, action }))
            )),
            filter((d) => d.absolutePositionModeId !== null && d.positionModeId !== null),
            mergeMap(({ positionModeId, absolutePositionModeId, action }) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this.hubStorage.get(action.io.hubId).ports.getPortValue(action.io.portId, positionModeId!, ValueTransformers.position).pipe(
                    concatWith(this.hubStorage.get(action.io.hubId)
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                   .ports.getPortValue(action.io.portId, absolutePositionModeId!, ValueTransformers.absolutePosition)
                    ),
                    bufferCount(2),
                    map(([ position, absolutePosition ]) => absolutePosition - position),
                    map((offset) => ATTACHED_IO_PROPS_ACTIONS.motorEncoderOffsetReceived({
                        hubId: action.io.hubId,
                        portId: action.io.portId,
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
        io: AttachedIoModel,
        portModeName: PortModeName
    ): Observable<number | null> {
        return this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectModeIdForIoAndPortModeName(io, portModeName)).pipe(
            filter((modeId) => modeId !== null),
            take(1)
        );
    }
}
