import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../../types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IState } from '../i-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { NEVER, of, switchMap } from 'rxjs';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { HubAttachIoEvent, HubMessageType, HubReply } from '../../lego-hub';

@Injectable()
export class ReadHubAttachedIoEffects {
    public readAttachIoEvents$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected),
        switchMap(() => this.lpuHubStorageService.getHub().hubAttachedIO.attachedIoReplies),
        switchMap((r: HubReply) => {
            if (r.type !== HubMessageType.hubAttachedIO) {
                return NEVER;
            }
            if (r.event === HubAttachIoEvent.Attached) {
                return of(ACTIONS_CONFIGURE_HUB.registerio({ portId: r.portId, ioType: r.ioTypeId }));
            } else {
                return of(ACTIONS_CONFIGURE_HUB.unregisterio({ portId: r.portId }));
            }
        })
    ));

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions: Actions,
        private readonly store: Store<IState>,
        private readonly snackBar: MatSnackBar,
        private readonly lpuHubStorageService: LpuHubStorageService
    ) {
    }
}
