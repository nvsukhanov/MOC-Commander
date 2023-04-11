import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IState } from '../i-state';
import { Store } from '@ngrx/store';
import { HUB_ATTACHED_IOS_ACTIONS, HUB_IO_OUTPUT_MODES } from '../actions';
import { filter, switchMap, take, tap } from 'rxjs';
import { HUB_IO_OUTPUT_MODES_SELECTORS } from '../selectors';
import { HubStorageService } from '../hub-storage.service';

@Injectable()
export class HubIOOutputModesEffects {
    public loadHubIOOutputModes$ = createEffect(() => this.actions$.pipe(
        ofType(HUB_ATTACHED_IOS_ACTIONS.registerio),
        tap((action) => {
            this.store.select(HUB_IO_OUTPUT_MODES_SELECTORS.selectHubPortInputModesByRevisions(
                action.hardwareRevision,
                action.softwareRevision,
                action.ioType)
            ).pipe(
                take(1),
                filter((data) => !data),
                switchMap(() => this.hubStorage.getHub(action.hubId).ports.getPortModes$(action.portId))
            ).subscribe((modesData) => {
                this.store.dispatch(HUB_IO_OUTPUT_MODES.portModesReceived({
                    hardwareRevision: action.hardwareRevision,
                    softwareRevision: action.softwareRevision,
                    ioType: action.ioType,
                    modes: modesData.inputModes
                }));
            });
        })
    ), { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        private readonly hubStorage: HubStorageService
    ) {
    }
}
