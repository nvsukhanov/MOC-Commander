import { Injectable } from '@angular/core';
import { Observable, Subject, bufferCount, catchError, concatAll, concatWith, delay, from, last, map, of, switchMap, take, takeUntil, timeout } from 'rxjs';
import { IHub, MOTOR_LIMITS, MotorServoEndState } from 'rxpoweredup';
import { transformRelativeDegToAbsoluteDeg } from '@app/shared-misc';

import { HubStorageService } from '../hub-storage.service';
import { HubMotorPositionFacadeService } from './hub-motor-position-facade.service';

export enum CalibrationResultType {
    finished,
    error
}

export type CalibrationResultFinished = {
    type: CalibrationResultType.finished;
    aposCenter: number;
    range: number;
};

export type CalibrationResultError = {
    type: CalibrationResultType.error;
    error: Error;
};

export type CalibrationResult = CalibrationResultFinished | CalibrationResultError;

@Injectable()
export class HubServoCalibrationFacadeService {
    constructor(
        private readonly hubStorage: HubStorageService,
        private readonly motorPositionFacade: HubMotorPositionFacadeService
    ) {
    }

    public calibrateServo(
        hubId: string,
        portId: number,
        speed: number,
        power: number
    ): Observable<CalibrationResult> {
        return new Observable<CalibrationResult>((subscriber) => {
            const cancel$ = new Subject<void>();
            this.doCalibration(hubId, portId, speed, power).pipe(
                takeUntil(cancel$),
                catchError((error) => {
                    console.warn('Calibration error', error);
                    return of({
                        type: CalibrationResultType.error,
                        error
                    } satisfies CalibrationResultError);
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
        speed: number,
        power: number,
    ): Observable<CalibrationResultFinished> {
        return this.getPreCalibrationData(hubId, portId).pipe(
            switchMap(({ startAbsolutePosition, startRelativePosition, cwLimit, ccwLimit }) => {
                return this.getServoRange(hubId, portId, speed, power, cwLimit, ccwLimit).pipe(
                    map((result) => {
                        return this.calculateServoCalibrationResults(
                            result.ccwProbeResult,
                            result.cwProbeResult,
                            startRelativePosition,
                            startAbsolutePosition
                        );
                    }),
                );
            }),
            switchMap((data) => this.finalizeCalibration(hubId, portId, speed, power, data.arcCenterPosition).pipe(
                map(() => {
                    const result: CalibrationResultFinished = {
                        type: CalibrationResultType.finished,
                        aposCenter: data.arcCenterAbsolutePosition,
                        range: data.servoRange
                    };
                    return result;
                })
            ))
        );
    }

    private getPreCalibrationData(
        hubId: string,
        portId: number,
    ): Observable<{ startRelativePosition: number; startAbsolutePosition: number; ccwLimit: number; cwLimit: number }> {
        return this.motorPositionFacade.getMotorPosition(hubId, portId).pipe(
            concatWith(this.motorPositionFacade.getMotorAbsolutePosition(hubId, portId)),
            bufferCount(2),
            map(([ startRelativePosition, startAbsolutePosition ]) => ({
                startRelativePosition,
                startAbsolutePosition,
                ccwLimit: startRelativePosition - MOTOR_LIMITS.maxServoDegreesRange * 2,
                cwLimit: startRelativePosition + MOTOR_LIMITS.maxServoDegreesRange * 2
            })),
            take(1)
        );
    }

    private finalizeCalibration(
        hubId: string,
        portId: number,
        speed: number,
        power: number,
        finalPosition: number
    ): Observable<unknown> {
        const hub = this.getHub(hubId);
        return hub.motors.goToPosition(portId, finalPosition, { speed, power, endState: MotorServoEndState.hold }).pipe(
            last(),
            // delay is necessary to ensure the motor is stabilized before the next command is sent
            delay(1000),
            concatWith(hub.motors.goToPosition(portId, finalPosition, { speed, power, endState: MotorServoEndState.float })),
            last(),
        );
    }

    private getServoRange(
        hubId: string,
        portId: number,
        speed: number,
        power: number,
        cwLimit: number,
        ccwLimit: number,
        calibrationRuns: number = 1,
        singleProbeTimeout: number = 5000
    ): Observable<{ ccwProbeResult: number; cwProbeResult: number }> {
        const hub = this.hubStorage.get(hubId);
        if (calibrationRuns < 1) {
            throw new Error('Calibration runs must be greater than 0');
        }

        const probe = (degree: number): Observable<number> => {
            return hub.motors.goToPosition(portId, degree, { speed, power, endState: MotorServoEndState.brake }).pipe(
                concatWith(this.motorPositionFacade.getMotorPosition(hubId, portId)),
                last(),
                timeout(singleProbeTimeout),
            ) as Observable<number>;
        };

        const probes: Array<Observable<number>> = [];
        for (let i = 0; i < calibrationRuns; i++) {
            probes.push(probe(ccwLimit));
            probes.push(probe(cwLimit));
        }

        return from(probes).pipe(
            concatAll(),
            bufferCount(2 * calibrationRuns),
            map((results) => {
                const ccwProbeResults = results.filter((_, i) => i % 2 === 0);
                const cwProbeResults = results.filter((_, i) => i % 2 === 1);
                return {
                    ccwProbeResult: Math.min(...ccwProbeResults),
                    cwProbeResult: Math.max(...cwProbeResults)
                };
            })
        );
    }

    private calculateServoCalibrationResults(
        ccwProbeResult: number,
        cwProbeResult: number,
        startRelativePosition: number,
        startAbsolutePosition: number
    ): { servoRange: number; arcCenterPosition: number; arcCenterAbsolutePosition: number } {
        const encoderOffset = startAbsolutePosition - startRelativePosition;
        const ccwDistanceFromStartPosition = startRelativePosition - ccwProbeResult;
        const cwDistanceFromStartPosition = cwProbeResult - startRelativePosition;

        const arcCenterPosition = Math.round((ccwProbeResult + cwProbeResult) / 2);

        const servoRange = Math.round(
            Math.min(
                Math.abs(cwDistanceFromStartPosition + ccwDistanceFromStartPosition), MOTOR_LIMITS.maxServoDegreesRange
            )
        );
        const arcCenterAbsolutePosition = Math.round(transformRelativeDegToAbsoluteDeg(arcCenterPosition + encoderOffset));

        return {
            servoRange,
            arcCenterPosition,
            arcCenterAbsolutePosition
        };
    }

    private getHub(
        hubId: string
    ): IHub {
        const hub = this.hubStorage.get(hubId);
        if (!hub) {
            throw new Error('Hub not found');
        }
        return hub;
    }
}
