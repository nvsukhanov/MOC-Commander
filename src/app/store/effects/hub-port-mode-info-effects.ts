import { Injectable } from '@angular/core';
import { HubStorageService } from '../hub-storage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IState } from '../i-state';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, zip } from 'rxjs';
import { HUB_PORT_MODE_INFO_ACTIONS } from '../actions/hub-port-mode-info.actions';
import { PortModeInformationName, PortModeInformationSymbol, PortModeInformationType, PortModeName, PortModeSymbol } from '../../lego-hub';
import { SELECT_IOS_ALL } from '../selectors';
import { HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS } from '../actions';

@Injectable()
export class HubPortModeInfoEffects {
    public loadPortModesInfo$ = createEffect(() => this.actions$.pipe(
        ofType(HUB_PORT_INPUT_MODES_BY_REVISION_ACTIONS.portModesReceived),
        withLatestFrom(this.store.select(SELECT_IOS_ALL)),
        tap(([ action, ios ]) => {
            const matchingIO = ios.find((io) => io.softwareRevision === action.softwareRevision
                && io.hardwareRevision === action.hardwareRevision
                && io.ioType === action.ioType
            );
            if (!matchingIO) {
                throw new Error('No hub found with matching IO');
            }
            const portApi = this.hubStorage.getHub(matchingIO.hubId).ports;
            zip(
                ...action.modes.map((mode) => portApi.getPortModeInformation$(matchingIO.portId, mode, PortModeInformationType.name)),
                ...action.modes.map((mode) => portApi.getPortModeInformation$(matchingIO.portId, mode, PortModeInformationType.symbol)),
            ).subscribe((data) => {
                const names = data.slice(0, action.modes.length) as PortModeInformationName[];
                const symbols = data.slice(action.modes.length) as PortModeInformationSymbol[];
                names.forEach((nameMode, index) => {
                    this.store.dispatch(HUB_PORT_MODE_INFO_ACTIONS.addPortModeData({
                        modeId: nameMode.mode,
                        ioType: action.ioType,
                        hardwareRevision: action.hardwareRevision,
                        softwareRevision: action.softwareRevision,
                        name: names[index].name as PortModeName,
                        symbol: symbols[index].symbol as PortModeSymbol
                    }));
                });
            });

        })
    ), { dispatch: false });

    public constructor(
        private readonly actions$: Actions,
        private readonly hubStorage: HubStorageService,
        private readonly store: Store<IState>
    ) {
    }
}
