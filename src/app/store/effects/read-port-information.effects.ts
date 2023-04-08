import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTIONS_CONFIGURE_HUB } from '../actions';
import { EMPTY, map, Subscription, switchMap, tap, zip } from 'rxjs';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { LoggingService } from '../../logging';
import { Store } from '@ngrx/store';
import { IState, PortModeData } from '../i-state';
import { PortModeInformationType, PortModeName, PortModeSymbol } from '../../lego-hub';

@Injectable()
export class ReadPortInformationEffects {
    public listenPortValueChanges$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((e) => e.type === ACTIONS_CONFIGURE_HUB.connected.type
                         ? this.lpuHubStorageService.getHub().ports.portValueReplies$
                         : EMPTY
        ),
        map((v) => ACTIONS_CONFIGURE_HUB.portValueUpdate({ portId: v.portId, value: [ ...v.payload ] }))
    ));

    public listenPortModeChanges$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.connected, ACTIONS_CONFIGURE_HUB.disconnected),
        switchMap((e) => e.type !== ACTIONS_CONFIGURE_HUB.connected.type
                         ? EMPTY
                         : this.lpuHubStorageService.getHub().ports.portModeReplies$
        ),
        map((v) => {
            this.portModeInformationListeners[v.portId]?.unsubscribe();
            this.portModeInformationListeners[v.portId] = undefined;

            const mergedModes = [ ...new Set([ ...v.inputModes, ...v.outputModes ]) ];
            const portsAPI = this.lpuHubStorageService.getHub().ports;

            this.portModeInformationListeners[v.portId] = zip(
                ...mergedModes.map((mode) => portsAPI.getPortModeInformationReplies$(v.portId, mode, PortModeInformationType.name)),
                ...mergedModes.map((mode) => portsAPI.getPortModeInformationReplies$(v.portId, mode, PortModeInformationType.symbol)),
            ).subscribe((d) => {
                const modeNamesMap = new Map<number, PortModeName>();
                const modeSymbolsMap = new Map<number, PortModeSymbol>();
                for (const c of d) {
                    if (c.modeInformationType === PortModeInformationType.name && Object.values(PortModeName).includes(c.name as PortModeName)) {
                        modeNamesMap.set(c.mode, c.name as PortModeName);
                    } else if (c.modeInformationType === PortModeInformationType.symbol && Object.values(PortModeSymbol).includes(c.symbol as PortModeSymbol)) {
                        modeSymbolsMap.set(c.mode, c.symbol as PortModeSymbol);
                    }
                }
                const result: { portId: number, inputModes: PortModeData, outputModes: PortModeData, currentMode: PortModeName } = {
                    portId: v.portId,
                    inputModes: {},
                    outputModes: {},
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    currentMode: modeNamesMap.get(v.currentModeId)!
                };
                for (const mode of v.inputModes) {
                    if (modeNamesMap.has(mode) && modeSymbolsMap.has(mode)) {
                        result.inputModes[mode] = {
                            name: modeNamesMap.get(mode) as PortModeName,
                            symbol: modeSymbolsMap.get(mode) as PortModeSymbol,
                        };
                    }
                }
                for (const mode of v.outputModes) {
                    if (modeNamesMap.has(mode) && modeSymbolsMap.has(mode)) {
                        result.outputModes[mode] = {
                            name: modeNamesMap.get(mode) as PortModeName,
                            symbol: modeSymbolsMap.get(mode) as PortModeSymbol,
                        };
                    }
                }
                this.store.dispatch(ACTIONS_CONFIGURE_HUB.portModeInformationUpdate(result));
            });

            for (const mode of mergedModes) {
                portsAPI.requestPortModeInformation(v.portId, mode, PortModeInformationType.name);
                portsAPI.requestPortModeInformation(v.portId, mode, PortModeInformationType.symbol);
            }
        })
    ), { dispatch: false });

    public onIoAttached$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.registerio),
        tap((d) => {
            this.lpuHubStorageService.getHub().ports.requestPortMode(d.portId);
            this.lpuHubStorageService.getHub().ports.requestPortValueInformation(d.portId);
        })
    ), { dispatch: false });

    public onIoDetached$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.unregisterio),
        tap((d) => {
                this.portModeInformationListeners[d.portId]?.unsubscribe();
                this.portModeInformationListeners[d.portId] = undefined;
            }
        )), { dispatch: false });

    public onHubDisconnected$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.disconnected),
        tap(() => {
                for (const listener of Object.values(this.portModeInformationListeners)) {
                    listener?.unsubscribe();
                }
                this.portModeInformationListeners = {};
            }
        )), { dispatch: false });

    private portModeInformationListeners: { [portId: number]: Subscription | undefined } = {};

    constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: LpuHubStorageService,
        private readonly logger: LoggingService,
        private readonly store: Store<IState>
    ) {
    }
}
