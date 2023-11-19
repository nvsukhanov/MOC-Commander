import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { PortModeName, ValueTransformers } from 'rxpoweredup';

import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS } from '../../selectors';
import { HUBS_ACTIONS } from '../../actions';
import { HubStorageService } from '../../hub-storage.service';

export const REQUEST_PORT_ABSOLUTE_POSITION_EFFECT = createEffect((
    actions$: Actions = inject(Actions),
    store: Store = inject(Store),
    hubStorageService: HubStorageService = inject(HubStorageService)
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.requestPortAbsolutePosition),
        concatLatestFrom((action) =>
            store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ ...action, portModeName: PortModeName.absolutePosition }))
        ),
        mergeMap(([ action, modeInfo ]) => {
            if (!modeInfo) {
                return of(HUBS_ACTIONS.portAbsolutePositionReadFailed({
                        hubId: action.hubId,
                        portId: action.portId,
                        error: new Error('Required absolute position mode not found')
                    })
                );
            }
            return hubStorageService.get(action.hubId).ports.getPortValue(action.portId, modeInfo.modeId, ValueTransformers.absolutePosition).pipe(
                map((position) => HUBS_ACTIONS.portAbsolutePositionRead({ hubId: action.hubId, portId: action.portId, position })),
                catchError((error) => {
                    return of(HUBS_ACTIONS.portAbsolutePositionReadFailed({ hubId: action.hubId, portId: action.portId, error }));
                })
            );
        })
    );
}, { functional: true });
