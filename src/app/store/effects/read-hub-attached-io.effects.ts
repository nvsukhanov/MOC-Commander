import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, NAVIGATOR } from '../../types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IState } from '../i-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { switchMap, tap } from 'rxjs';
import { ACTIONS_CONFIGURE_HUB } from '../actions';

@Injectable()
export class ReadHubAttachedIoEffects {
    public readAllAttachedIo$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected),
        switchMap(() => this.lpuHubStorageService.getHub().hubAttachedIO.attachedIoReplies),
        tap((d) => console.log('rcvd', d))
    ), { dispatch: false });

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions: Actions,
        private readonly store: Store<IState>,
        private readonly snackBar: MatSnackBar,
        private readonly lpuHubStorageService: LpuHubStorageService
    ) {
    }
}
