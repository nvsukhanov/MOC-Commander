import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MOTOR_OPERATIONS_ACTIONS } from '../actions';
import { LpuHubStorageService } from '../lpu-hub-storage.service';
import { tap } from 'rxjs';

@Injectable()
export class MotorOperationsEffects {
    public readonly startRotation$ = createEffect(() => this.actions$.pipe(
        ofType(MOTOR_OPERATIONS_ACTIONS.setMotorSpeed),
        tap((action) => {
            this.lpuHubStorageService.getHub().motor.startRotation(
                action.portId,
                action.speed,
                action.power,
                action.profile,
                action.startupMode,
                action.completionMode
            );
        })
    ), { dispatch: false });

    public constructor(
        private readonly actions$: Actions,
        private readonly lpuHubStorageService: LpuHubStorageService,
    ) {
    }
}
