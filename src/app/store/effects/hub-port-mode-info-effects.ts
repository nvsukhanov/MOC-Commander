import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, takeUntil, zip } from 'rxjs';
import { PortModeInformationName, PortModeInformationSymbol, PortModeInformationType, PortModeName, PortModeSymbol } from '@nvsukhanov/rxpoweredup';

import { HUB_IO_SUPPORTED_MODES, HUB_PORT_MODE_INFO_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';
import { HUB_ATTACHED_IO_SELECTORS } from '../selectors';
import { hubPortModeInfoIdFn } from '../entity-adapters';

@Injectable()
export class HubPortModeInfoEffects {
    public loadPortModesInfo$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_IO_SUPPORTED_MODES.portModesReceived),
            concatLatestFrom(() => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsAll)),
            mergeMap(([ action, ios ]) => {
                const matchingIO = ios.find((io) => io.hubId === action.io.hubId && io.portId === action.io.portId);
                if (!matchingIO) {
                    throw new Error('No hub found with matching IO');
                }
                const portApi = this.hubStorage.get(matchingIO.hubId).ports;
                const concatenatedPortModeIds = [ ...new Set([ ...action.portOutputModes, ...action.portInputModes ]) ];

                return zip(
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation(matchingIO.portId, mode, PortModeInformationType.name)),
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation(matchingIO.portId, mode, PortModeInformationType.symbol)),
                ).pipe(
                    takeUntil(this.hubStorage.get(matchingIO.hubId).disconnected),
                    map((data) => {
                        const names = data.slice(0, concatenatedPortModeIds.length) as PortModeInformationName[];
                        const symbols = data.slice(concatenatedPortModeIds.length) as PortModeInformationSymbol[];
                        const dataSets = names.map((nameMode, index) => ({
                            id: hubPortModeInfoIdFn({ io: matchingIO, modeId: nameMode.mode }),
                            modeId: nameMode.mode,
                            name: names[index].name as PortModeName,
                            symbol: symbols[index].symbol as PortModeSymbol
                        }));
                        return HUB_PORT_MODE_INFO_ACTIONS.addPortModeData({ dataSets });
                    })
                );
            }),
        );
    });

    public constructor(
        private readonly actions$: Actions,
        private readonly hubStorage: HubStorageService,
        private readonly store: Store
    ) {
    }
}
