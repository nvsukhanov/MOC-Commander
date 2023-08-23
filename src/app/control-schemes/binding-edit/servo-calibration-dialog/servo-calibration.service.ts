import { Injectable } from '@angular/core';
import { MOTOR_LIMITS, MotorServoEndState, PortModeName } from '@nvsukhanov/rxpoweredup';
import { Observable, Subject, bufferCount, catchError, concat, concatWith, first, last, map, of, switchMap, take, takeUntil, timeout, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, HubStorageService } from '@app/store';
import { transformRelativeDegToAbsoluteDeg } from '@app/shared';

import { CalibrationResult, CalibrationResultError, CalibrationResultFinished, CalibrationResultType } from './servo-calibration-result';

@Injectable()
export class ServoCalibrationService {
    constructor(
        private readonly store: Store,
        private readonly hubStorage: HubStorageService
    ) {
    }

    public calibrateServo(
        hubId: string,
        portId: number,
        power: number
    ): Observable<CalibrationResult> {
        return new Observable<CalibrationResult>((subscriber) => {
            const cancel$ = new Subject<void>();
            zip(
                this.store.select(
                    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ hubId, portId, portModeName: PortModeName.position })
                ),
                this.store.select(
                    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({ hubId, portId, portModeName: PortModeName.absolutePosition })
                )
            ).pipe(
                take(1),
                switchMap(([ positionModeInfo, absolutePositionModeInfo ]) => {
                    if (absolutePositionModeInfo === null) {
                        throw new Error('Required absolute position mode not found');
                    }
                    if (positionModeInfo === null) {
                        throw new Error('Required position mode found not found');
                    }
                    return this.doCalibration(
                        hubId,
                        portId,
                        positionModeInfo.modeId,
                        absolutePositionModeInfo.modeId,
                        power
                    );
                }),
                takeUntil(cancel$),
                catchError((error) => {
                    const result: CalibrationResultError = {
                        type: CalibrationResultType.error,
                        error
                    };
                    return of(result);
                })
            ).subscribe(subscriber);

            return () => {
                cancel$.next();
                cancel$.complete();
            };
        });
    }

    private doCalibration(
        hubId: string,
        portId: number,
        positionModeId: number,
        absolutePositionModeId: number,
        power: number,
    ): Observable<CalibrationResultFinished> {
        const hub = this.hubStorage.get(hubId);
        if (!hub) {
            throw new Error('Hub not found');
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
            take(1),
            switchMap(({ startAbsolutePosition, startRelativePosition, cwLimit, ccwLimit }) => {
                return concat(
                    probeReachability(ccwLimit),
                    probeReachability(cwLimit),
                    probeReachability(ccwLimit),
                    probeReachability(cwLimit)
                ).pipe(
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
                    switchMap((data) => hub.motors.goToPosition( // TODO: fix issue with acrCenterFromStart being absolute. It should be relative
                        portId,
                        data.arcCenterFromStart,
                        { power, endState: MotorServoEndState.brake }
                    ).pipe(
                        first(),
                        map(() => {
                            const result: CalibrationResultFinished = {
                                type: CalibrationResultType.finished,
                                aposCenter: data.arcAbsoluteCenter,
                                range: data.servoRange
                            };
                            return result;
                        })
                    ))
                );
            })
        );
    }
}
