import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { SERVO_CALIBRATION_ACTIONS } from '../actions';
import { bufferCount, catchError, concatWith, last, map, NEVER, Observable, of, race, switchMap, tap, timeout } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ServoCalibrationDialogComponent } from '../../control-schemes/servo-calibration-dialog';
import { Action, Store } from '@ngrx/store';
import { HubStorageService } from '../hub-storage.service';
import { MOTOR_LIMITS, MotorServoEndState, PortModeName } from '@nvsukhanov/rxpoweredup';
import { HUB_ATTACHED_IO_SELECTORS } from '../selectors';

@Injectable()
export class ServoCalibrationEffects {
    public readonly doCalibration$ = createEffect(() => {
        return this.actions.pipe(
            ofType(SERVO_CALIBRATION_ACTIONS.startCalibration),
            concatLatestFrom((action) =>
                this.store.select(HUB_ATTACHED_IO_SELECTORS.selectHubPortInputModeForPortModeName(action.hubId, action.portId, PortModeName.position))
            ),
            switchMap(([ action, portModeInfo ]) => {
                if (portModeInfo === null) {
                    return of(
                        SERVO_CALIBRATION_ACTIONS.calibrationError({ error: new Error('No position mode found') })
                    );
                }
                return race(
                    this.doCalibration(action.hubId, action.portId, portModeInfo.modeId, action.power),
                    this.actions.pipe(ofType(SERVO_CALIBRATION_ACTIONS.cancelCalibration)).pipe(
                        map(() => SERVO_CALIBRATION_ACTIONS.calibrationCancelled())
                    )
                );
            }),
            catchError((error) => of(SERVO_CALIBRATION_ACTIONS.calibrationError({ error })))
        );
    });

    public showCalibrationModal$ = createEffect(() => {
        return this.actions.pipe(
            ofType(SERVO_CALIBRATION_ACTIONS.startCalibration),
            tap(() => {
                this.dialogRef = this.dialog.open(
                    ServoCalibrationDialogComponent,
                    {
                        hasBackdrop: true,
                        disableClose: true
                    }
                );
            }),
            switchMap(() => this.dialogRef?.componentInstance?.cancel ?? NEVER),
            map(() => SERVO_CALIBRATION_ACTIONS.cancelCalibration()),
        );
    });

    public hideCalibrationModal$ = createEffect(() => {
        return this.actions.pipe(
            ofType(
                SERVO_CALIBRATION_ACTIONS.calibrationFinished,
                SERVO_CALIBRATION_ACTIONS.calibrationCancelled,
                SERVO_CALIBRATION_ACTIONS.calibrationError
            ),
            tap(() => {
                this.dialogRef?.close();
                this.dialogRef = undefined;
            })
        );
    }, { dispatch: false });

    private dialogRef?: DialogRef<unknown, ServoCalibrationDialogComponent>;

    constructor(
        private readonly store: Store,
        private readonly actions: Actions,
        private readonly dialog: Dialog,
        private readonly hubStorage: HubStorageService
    ) {
    }

    private doCalibration(
        hubId: string,
        portId: number,
        positionModeId: number,
        power: number
    ): Observable<Action> {
        const hub = this.hubStorage.get(hubId);
        if (!hub) {
            return of(SERVO_CALIBRATION_ACTIONS.calibrationError({ error: new Error('Hub not found') }));
        }

        const probeReachability = (degree: number): Observable<number> => {
            return hub.commands.goToAbsoluteDegree(portId, degree, { power, endState: MotorServoEndState.brake }).pipe(
                concatWith(hub.ports.getPortValue(portId, positionModeId, PortModeName.position).pipe(
                    map((r) => r.position)
                )),
                last()
            ) as Observable<number>;
        };

        return probeReachability(-MOTOR_LIMITS.maxServoDegreesRange).pipe(
            concatWith(probeReachability(MOTOR_LIMITS.maxServoDegreesRange)),
            concatWith(probeReachability(-MOTOR_LIMITS.maxServoDegreesRange)),
            concatWith(probeReachability(MOTOR_LIMITS.maxServoDegreesRange)),
            concatWith(probeReachability(0)),
            timeout(5000),
            bufferCount(5),
            map(([ min1, max1, min2, max2 ]) => {
                const min = Math.min(min1, min2);
                const max = Math.max(max1, max2);
                return SERVO_CALIBRATION_ACTIONS.calibrationFinished({ hubId, portId, min, max });
            }),
        );
    }
}
