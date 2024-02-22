import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Observable, concat, switchMap } from 'rxjs';
import { MotorServoEndState } from 'rxpoweredup';

import { HubStorageService } from '../../hub-storage.service';
import { HUBS_ACTIONS } from '../../actions';

export const SET_MOTOR_POSITION_EFFECT = createEffect((
    actions$: Actions = inject(Actions),
    hubStorageService: HubStorageService = inject(HubStorageService)
): Observable<unknown> => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.setPortPosition),
        switchMap((action) => {
            const hub = hubStorageService.get(action.hubId);
            return concat(
                hub.motors.goToPosition(action.portId, action.position, { endState: MotorServoEndState.hold }),
                hub.motors.startSpeed(action.portId, 0, { power: 0 })
            );
        }),
    );
}, { functional: true, dispatch: false });
