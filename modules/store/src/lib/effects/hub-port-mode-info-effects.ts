import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, takeUntil, zip } from 'rxjs';
import { PortModeInformationName, PortModeInformationSymbol, PortModeInformationType, PortModeName, PortModeSymbol } from 'rxpoweredup';

import { ATTACHED_IO_MODES_ACTIONS, HUB_PORT_MODE_INFO_ACTIONS } from '../actions';
import { HubStorageService } from '../hub-storage.service';
import { ATTACHED_IO_SELECTORS } from '../selectors';
import { attachedIoPortModeInfoIdFn } from '../reducers';

@Injectable()
export class HubPortModeInfoEffects {
    public loadPortModesInfo$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ATTACHED_IO_MODES_ACTIONS.portModesReceived),
            concatLatestFrom(() => this.store.select(ATTACHED_IO_SELECTORS.selectAll)),
            mergeMap(([ action, ios ]) => {
                const matchingIo = ios.find((io) => io.hubId === action.io.hubId && io.portId === action.io.portId);
                if (!matchingIo) {
                    throw new Error('No hub found with matching IO');
                }
                const portApi = this.hubStorage.get(matchingIo.hubId).ports;
                const concatenatedPortModeIds = [ ...new Set([ ...action.portOutputModes, ...action.portInputModes ]) ];

                return zip(
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation(matchingIo.portId, mode, PortModeInformationType.name)),
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation(matchingIo.portId, mode, PortModeInformationType.symbol)),
                ).pipe(
                    takeUntil(this.hubStorage.get(matchingIo.hubId).disconnected),
                    map((data) => {
                        const names = data.slice(0, concatenatedPortModeIds.length) as PortModeInformationName[];
                        const symbols = data.slice(concatenatedPortModeIds.length) as PortModeInformationSymbol[];
                        const dataSets = names.map((nameMode, index) => ({
                            id: attachedIoPortModeInfoIdFn({ ...matchingIo, modeId: nameMode.mode }),
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
