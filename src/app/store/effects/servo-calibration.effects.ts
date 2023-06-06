import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { NEVER, Observable, bufferCount, catchError, concatWith, first, last, map, of, race, switchMap, tap, timeout } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Action, Store } from '@ngrx/store';
import { MOTOR_LIMITS, MotorServoEndState, PortModeName } from '@nvsukhanov/rxpoweredup';

import { ServoCalibrationDialogComponent } from '../../control-schemes/servo-calibration-dialog';
import { HubStorageService } from '../hub-storage.service';
import { SERVO_CALIBRATION_ACTIONS } from '../actions';
import { HUB_ATTACHED_IO_SELECTORS } from '../selectors';
import { transformRelativeDegToAbsoluteDeg } from '../../common';

@Injectable()
export class ServoCalibrationEffects {
    public readonly doCalibration$ = createEffect(() => {
        return this.actions.pipe(
            ofType(SERVO_CALIBRATION_ACTIONS.startCalibration),
            concatLatestFrom((action) => [
                this.store.select(HUB_ATTACHED_IO_SELECTORS.selectHubPortInputModeForPortModeName(action.hubId, action.portId, PortModeName.position)),
                this.store.select(HUB_ATTACHED_IO_SELECTORS.selectHubPortInputModeForPortModeName(action.hubId, action.portId, PortModeName.absolutePosition)),
            ]),
            switchMap(([ action, positionModeInfo, absolutePositionModeInfo ]) => {
                if (absolutePositionModeInfo === null || positionModeInfo === null) {
                    return of(
                        SERVO_CALIBRATION_ACTIONS.calibrationError({ error: new Error('No position mode found') })
                    );
                }
                return race(
                    this.doCalibration(
                        action.hubId,
                        action.portId,
                        positionModeInfo.modeId,
                        absolutePositionModeInfo.modeId,
                        action.power
                    ),
                    this.actions.pipe(ofType(SERVO_CALIBRATION_ACTIONS.cancelCalibration)).pipe(
                        map(() => SERVO_CALIBRATION_ACTIONS.calibrationCancelled())
                    )
                ).pipe(
                    catchError((error) => {
                        console.error(error);
                        return of(SERVO_CALIBRATION_ACTIONS.calibrationError({ error }));
                    })
                );
            }),
        );
    });

    public showCalibrationModal$ = createEffect(() => {
        return this.actions.pipe(
            ofType(SERVO_CALIBRATION_ACTIONS.startCalibration),
            switchMap(() => {
                if (this.dialogRef) {
                    this.dialogRef.close();
                }
                this.dialogRef = this.dialog.open(
                    ServoCalibrationDialogComponent,
                    {
                        hasBackdrop: true,
                        disableClose: true
                    }
                );
                return this.dialogRef.componentInstance?.cancel.asObservable() ?? NEVER;
            }),
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
        absolutePositionModeId: number,
        power: number
    ): Observable<Action> {
        const hub = this.hubStorage.get(hubId);
        if (!hub) {
            return of(SERVO_CALIBRATION_ACTIONS.calibrationError({ error: new Error('Hub not found') }));
        }

        const probeReachability = (degree: number): Observable<number> => {
            return hub.motors.goToPosition(portId, degree, { power, endState: MotorServoEndState.brake }).pipe(
                concatWith(hub.motors.getPosition(portId, positionModeId)),
                last()
            ) as Observable<number>;
        };

        return hub.motors.getPosition(portId, positionModeId).pipe(
            last(),
            concatWith(hub.motors.getAbsolutePosition(portId, absolutePositionModeId)),
            bufferCount(2),
            map(([ startRelativePosition, startAbsolutePosition ]) => ({
                startRelativePosition,
                startAbsolutePosition,
                ccwLimit: startRelativePosition - MOTOR_LIMITS.maxServoDegreesRange,
                cwLimit: startRelativePosition + MOTOR_LIMITS.maxServoDegreesRange
            })),
            switchMap(({ startAbsolutePosition, startRelativePosition, cwLimit, ccwLimit }) => {
                return probeReachability(ccwLimit).pipe(
                    concatWith(probeReachability(cwLimit)),
                    concatWith(probeReachability(ccwLimit)),
                    concatWith(probeReachability(cwLimit)),
                    timeout(5000),
                    bufferCount(4),
                    map(([ min1, max1, min2, max2 ]) => {
                        const min = Math.min(min1, min2);
                        const max = Math.max(max1, max2);
                        const ccwDistanceFromEncoderZero = min - startRelativePosition;
                        const cwDistanceFromEncoderZero = max - startRelativePosition;
                        const arcCenterFromEncoderZero = (ccwDistanceFromEncoderZero + cwDistanceFromEncoderZero) / 2;

                        const servoRange = Math.min(
                            Math.abs(ccwDistanceFromEncoderZero) + Math.abs(cwDistanceFromEncoderZero),
                            MOTOR_LIMITS.maxServoDegreesRange
                        );
                        const arcAbsoluteCenter = servoRange === MOTOR_LIMITS.maxServoDegreesRange
                                                  ? 0
                                                  : transformRelativeDegToAbsoluteDeg(startAbsolutePosition + arcCenterFromEncoderZero);
                        const arcCenterFromStart = servoRange === MOTOR_LIMITS.maxServoDegreesRange
                                                   ? -startAbsolutePosition
                                                   : (min + max) / 2;

                        return {
                            servoRange,
                            arcCenterFromStart,
                            arcAbsoluteCenter
                        };
                    }),
                    switchMap((data) => hub.motors.goToPosition(
                        portId,
                        data.arcCenterFromStart,
                        { power, endState: MotorServoEndState.float }
                    ).pipe(
                        first(),
                        map(() => {
                            return SERVO_CALIBRATION_ACTIONS.calibrationFinished({
                                hubId,
                                portId,
                                aposCenter: data.arcAbsoluteCenter,
                                range: data.servoRange
                            });
                        })
                    ))
                );
            }),
        );
    }
}
