import { Injectable } from '@angular/core';
import { HubStorageService } from '../hub-storage.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, zip } from 'rxjs';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions/hub-port-mode-info.actions';
import { PortModeInformationName, PortModeInformationSymbol, PortModeInformationType, PortModeName, PortModeSymbol } from '../../lego-hub';
import { HUB_ATTACHED_IO_SELECTORS } from '../selectors';
import { HUB_IO_SUPPORTED_MODES } from '../actions';

@Injectable()
export class HubPortModeInfoEffects {
    public loadPortModesInfo$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(HUB_IO_SUPPORTED_MODES.portModesReceived),
            concatLatestFrom(() => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsAll)),
            mergeMap(([ action, ios ]) => {
                const matchingIO = ios.find((io) => io.softwareRevision === action.softwareRevision
                    && io.hardwareRevision === action.hardwareRevision
                    && io.ioType === action.ioType
                );
                if (!matchingIO) {
                    throw new Error('No hub found with matching IO');
                }
                const portApi = this.hubStorage.getHub(matchingIO.hubId).ports;
                const concatenatedPortModeIds = [ ...new Set([ ...action.portOutputModes, ...action.portInputModes ]) ];

                return zip(
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation$(matchingIO.portId, mode, PortModeInformationType.name)),
                    ...concatenatedPortModeIds.map((mode) => portApi.getPortModeInformation$(matchingIO.portId, mode, PortModeInformationType.symbol)),
                ).pipe(
                    map((data) => {
                        const names = data.slice(0, concatenatedPortModeIds.length) as PortModeInformationName[];
                        const symbols = data.slice(concatenatedPortModeIds.length) as PortModeInformationSymbol[];
                        const dataSets = names.map((nameMode, index) => ({
                            modeId: nameMode.mode,
                            ioType: action.ioType,
                            hardwareRevision: action.hardwareRevision,
                            softwareRevision: action.softwareRevision,
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
