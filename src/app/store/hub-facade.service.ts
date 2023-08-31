import { Injectable } from '@angular/core';
import { Observable, last, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';

import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS } from './selectors';
import { HubStorageService } from './hub-storage.service';

@Injectable()
export class HubFacadeService {
    constructor(
        private readonly hubStorage: HubStorageService,
        private readonly store: Store
    ) {
    }

    public getMotorAbsolutePosition(
        hubId: string,
        portId: number
    ): Observable<number> {
        return this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({
            hubId,
            portId,
            portModeName: PortModeName.absolutePosition
        })).pipe(
            take(1),
            switchMap((modeInfo) => modeInfo !== null
                                    ? this.hubStorage.get(hubId).motors.getAbsolutePosition(portId, modeInfo.modeId)
                                    : throwError(() => new Error('Required absolute position mode not found'))),
            last()
        );
    }

    public getMotorPosition(
        hubId: string,
        portId: number
    ): Observable<number> {
        return this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({
            hubId,
            portId,
            portModeName: PortModeName.position
        })).pipe(
            take(1),
            switchMap((modeInfo) => modeInfo !== null
                                    ? this.hubStorage.get(hubId).motors.getPosition(portId, modeInfo.modeId)
                                    : throwError(() => new Error('Required position mode not found'))),
            last()
        );
    }
}
