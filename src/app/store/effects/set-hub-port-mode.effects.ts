import { Injectable } from '@angular/core';
import { IState } from '../i-state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { of, switchMap, zip } from 'rxjs';
import { SELECT_PORT_AVAILABLE_INPUT_MODE_MAP } from '../selectors';
import { ACTIONS_CONFIGURE_HUB } from '../actions';

@Injectable()
export class SetHubPortModeEffects {
    public setPortMode$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.setPortMode),
        switchMap((action) => zip(
            of(action),
            this.store.select(SELECT_PORT_AVAILABLE_INPUT_MODE_MAP(action.portId))
        )),
        switchMap(([ action, portModeMap ]) => {
            const modeId = portModeMap[action.mode];
            if (!modeId) {
                throw new Error(`Unknown port mode: ${action.mode}`);
            }
            return this.lpuHubStorageService.getHub().ports.setPortInputFormat(
                action.portId,
                modeId,
                action.subscribe
            ).then(() => {
                return ACTIONS_CONFIGURE_HUB.portModeSetCompleted({ portId: action.portId, mode: action.mode });
            });
        })
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        private readonly lpuHubStorageService: LpuHubStorageService
    ) {
    }
}
