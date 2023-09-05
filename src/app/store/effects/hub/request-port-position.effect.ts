import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, HUBS_ACTIONS, HubStorageService } from '@app/store';

export const REQUEST_PORT_POSITION_EFFECT = createEffect((
    actions$: Actions = inject(Actions),
    store: Store = inject(Store),
    hubStorageService: HubStorageService = inject(HubStorageService)
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.requestPortPosition),
        concatLatestFrom((action) =>
            store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ ...action, portModeName: PortModeName.position }))
        ),
        mergeMap(([ action, modeInfo ]) => {
            if (!modeInfo) {
                return of(HUBS_ACTIONS.portPositionReadFailed({
                        hubId: action.hubId,
                        portId: action.portId,
                        error: new Error('Required position mode not found')
                    })
                );
            }
            return hubStorageService.get(action.hubId).motors.getPosition(action.portId, modeInfo.modeId).pipe(
                map((position) => HUBS_ACTIONS.portPositionRead({ hubId: action.hubId, portId: action.portId, position })),
                catchError((error) => {
                    return of(HUBS_ACTIONS.portPositionReadFailed({ hubId: action.hubId, portId: action.portId, error }));
                })
            );
        })
    );
}, { functional: true });
