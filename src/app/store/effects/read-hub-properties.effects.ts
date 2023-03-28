import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { map, of, switchMap } from 'rxjs';
import { LpuHubStorageService } from '../lpu-hub-storage.service';

@Injectable()
export class ReadHubPropertiesEffects {
    public readonly readBatteryLevel = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((d) => d.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().hubProperties.batteryLevel$
                         : of(null)
        ),
        map((batteryLevel) => ACTIONS_CONFIGURE_HUB.batteryLevelUpdate({ batteryLevel }))
    ));

    public readonly readRssiLevel = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((d) => d.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().hubProperties.rssiLevel$
                         : of(null)
        ),
        map((rssiLevel) => ACTIONS_CONFIGURE_HUB.rssiLevelUpdate({ rssiLevel }))
    ));

    constructor(
        private readonly actions: Actions,
        private readonly lpuHubStorageService: LpuHubStorageService
    ) {
    }
}
