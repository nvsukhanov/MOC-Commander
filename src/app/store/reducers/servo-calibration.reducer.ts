import { createFeature, createReducer, on } from '@ngrx/store';

import { SERVO_CALIBRATION_ACTIONS } from '../actions';

export type ServoCalibrationState = {
    calibrationInProgress: boolean;
}

export const SERVO_CALIBRATION_INITIAL_STATE = {
    calibrationInProgress: false
};

export const SERVO_CALIBRATION_FEATURE = createFeature({
    name: 'servoCalibration',
    reducer: createReducer(
        SERVO_CALIBRATION_INITIAL_STATE,
        on(SERVO_CALIBRATION_ACTIONS.startCalibration, (state): ServoCalibrationState => {
            return {
                ...state,
                calibrationInProgress: true
            };
        }),
        on(SERVO_CALIBRATION_ACTIONS.calibrationFinished, (state): ServoCalibrationState => {
            return {
                ...state,
                calibrationInProgress: false
            };
        }),
        on(SERVO_CALIBRATION_ACTIONS.calibrationCancelled, (state): ServoCalibrationState => {
            return {
                ...state,
                calibrationInProgress: false
            };
        }),
        on(SERVO_CALIBRATION_ACTIONS.calibrationError, (state): ServoCalibrationState => {
            return {
                ...state,
                calibrationInProgress: false
            };
        })
    )
});
