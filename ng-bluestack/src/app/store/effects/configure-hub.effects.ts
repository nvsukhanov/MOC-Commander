/// <reference types="web-bluetooth" />
// TODO: ambient typing?

import { Inject, Injectable } from '@angular/core';
import { ExtractTokenType, LEGO_SERVICES_UUIDS, NAVIGATOR } from '../../types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTION_CONFIGURE_HUB_TERMINATION, ACTIONS_CONFIGURE_HUB } from '../actions';
import { IState } from '../i-state';
import { catchError, map, NEVER, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { TypedAction } from '@ngrx/store/src/models';

@Injectable()
export class ConfigureHubEffects {
    public readonly startListening$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.startDiscovery),
        switchMap(() => fromPromise(this.navigator.bluetooth.requestDevice({
            filters: [ {
                services: [ LEGO_SERVICES_UUIDS.LPF2PrimaryService ]
            } ],
            optionalServices: [ LEGO_SERVICES_UUIDS.batteryService, LEGO_SERVICES_UUIDS.deviceInformation ]
        }))),
        map((device) => !device.gatt ? ACTIONS_CONFIGURE_HUB.deviceConnectedGattUnavailable({ device }) : ACTIONS_CONFIGURE_HUB.deviceConnected({ device })),
        catchError((e) => this.withLog(e, ACTIONS_CONFIGURE_HUB.deviceConnectFailed()))
    ));

    public readonly deviceConnectFailedNotification$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.deviceConnectFailed),
        tap(() => this.snackBar.open('Device connect failed'))
    ), { dispatch: false });

    public readonly showGattUnavailableNotification$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.deviceConnectedGattUnavailable),
        tap(() => this.snackBar.open('GATT unavailable')) // TODO: l10n
    ), { dispatch: false });

    public readonly connectGatt$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.deviceConnected),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        switchMap((action) =>
            fromPromise(action.device.gatt!.connect()).pipe(
                map((server) => ACTIONS_CONFIGURE_HUB.gattConnected({ device: action.device, server })),
                catchError((e) => this.withLog(e, ACTIONS_CONFIGURE_HUB.gattCannotBeConnected({ device: action.device })))
            )
        )
    ));

    public readonly showGattCannotBeConnectedNotification$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.gattCannotBeConnected),
        tap(() => this.snackBar.open('GATT cannot be connected')) // TODO: l10n
    ), { dispatch: false });

    public readonly connectPrimaryService$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.gattConnected),
        switchMap((action) => fromPromise(action.server.getPrimaryService(LEGO_SERVICES_UUIDS.LPF2PrimaryService)).pipe(
            map((service) => ACTIONS_CONFIGURE_HUB.primaryServiceConnected({ device: action.device, service })),
            catchError((e) => this.withLog(e, ACTIONS_CONFIGURE_HUB.primaryServiceConnectionError({ device: action.device })))
        ))
    ));

    public readonly showPrimaryServiceCannotBeConnectedNotification$ = createEffect(() => this.actions.pipe(
        ofType(ACTIONS_CONFIGURE_HUB.primaryServiceConnectionError),
        tap(() => this.snackBar.open('Primary service cannot be connected'))
    ), { dispatch: false });

    public deviceDisconnect$ = createEffect(() => this.actions.pipe(
        ofType(
            ACTIONS_CONFIGURE_HUB.gattConnected,
            ...ACTION_CONFIGURE_HUB_TERMINATION
        ),
        switchMap((action) => {
                console.log(action.type);
                if (action.type === ACTIONS_CONFIGURE_HUB.gattConnected.type) {
                    const subj = new Subject<void>();
                    action.device.ongattserverdisconnected = () => subj.next(); // addEventListener doesn't work on device, seems like not implemented yet
                    return subj;
                } else {
                    return NEVER;
                }
            }
        ),
        map(() => ACTIONS_CONFIGURE_HUB.deviceConnectFailed())
    ));

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly actions: Actions,
        private readonly store: Store<IState>,
        private readonly snackBar: MatSnackBar
    ) {
    }

    private withLog<T extends string>(e: Error, a: TypedAction<T>): Observable<TypedAction<T>> {  // TODO: make proper logging service
        console.error(e);
        return of(a);
    }
}
