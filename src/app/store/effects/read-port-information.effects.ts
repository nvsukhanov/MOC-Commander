import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { from, Subscription, switchMap, tap } from 'rxjs';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { LoggingService } from '../../logging';

@Injectable()
export class ReadPortInformationEffects {
    private portValueListeners: Map<number, Subscription> = new Map();

    public listenForPortValue$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.registerio),
        tap((d) => {
            const sub = from(this.lpuHubStorageService.getHub().ports.requestPortValueInformation(d.portId)).pipe(
                switchMap(() => this.lpuHubStorageService.getHub().ports.listenForPortValue$(d.portId)),
            ).subscribe((v) => {
                this.logger.debug(`Received port value information, port: ${v.portId}, payload: ${v.payload}`);
            });
            this.portValueListeners.set(d.portId, sub);
        }),
    ), { dispatch: false });

    public onIoUnregister$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.unregisterio),
        tap((d) => {
                const sub = this.portValueListeners.get(d.portId);
                if (sub) {
                    sub.unsubscribe();
                    this.portValueListeners.delete(d.portId);
                }
            }
        )), { dispatch: false });

    private portModeListeners: Map<number, Subscription> = new Map();

    public requestPortMode$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.registerio),
        tap((d) => {
            const sub = from(this.lpuHubStorageService.getHub().ports.requestPortModeInformation(d.portId)).pipe(
                switchMap(() => this.lpuHubStorageService.getHub().ports.listenForPortMode$(d.portId)),
            ).subscribe((v) => {
                this.logger.debug(`Received port mode information, port: ${v.portId}, payload: ${v.payload}`);
            });
            this.portModeListeners.set(d.portId, sub);
        })
    ), { dispatch: false });

    public onHubDisconnected$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.disconnected),
        tap(() => {
                this.portValueListeners.forEach((v) => v.unsubscribe());
                this.portValueListeners.clear();
                this.portModeListeners.forEach((v) => v.unsubscribe());
                this.portModeListeners.clear();
            }
        )), { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: LpuHubStorageService,
        private readonly logger: LoggingService
    ) {
    }
}
