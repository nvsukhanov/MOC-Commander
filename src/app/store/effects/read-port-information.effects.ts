import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { EMPTY, map, switchMap, tap } from 'rxjs';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { LoggingService } from '../../logging';
import { Store } from '@ngrx/store';
import { IState } from '../i-state';

@Injectable()
export class ReadPortInformationEffects {
    public listenPortValueChanges$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((e) => e.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().ports.listenAllPortValues$()
                         : EMPTY
        ),
        map((v) => ACTIONS_CONFIGURE_HUB.portValueUpdate({ portId: v.portId, value: [ ...v.payload ] }))
    ));

    public listenPortModeChanges$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((e) => e.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().ports.listenAllPortModes$()
                         : EMPTY
        ),
        map((v) => {
            return ACTIONS_CONFIGURE_HUB.portModeInformationUpdate({
                portId: v.portId,
                modesInformation: {
                    capabilities: v.capabilities,
                    totalModeCount: v.totalModeCount,
                    inputModes: v.inputModes,
                    outputModes: v.outputModes,
                }
            });
        })
    ));

    public onIoAttached$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.registerio),
        tap((d) => {
            this.lpuHubStorageService.getHub().ports.requestPortModeInformation(d.portId);
            this.lpuHubStorageService.getHub().ports.requestPortValueInformation(d.portId);
        })
    ), { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: LpuHubStorageService,
        private readonly logger: LoggingService,
        private readonly store: Store<IState>
    ) {
    }
}
