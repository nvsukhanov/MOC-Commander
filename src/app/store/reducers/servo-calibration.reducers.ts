import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { SERVO_CALIBRATION_ACTIONS } from '../actions';
import { IState } from '../i-state';

export const SERVO_CALIBRATION_REDUCERS = createReducer(
    INITIAL_STATE.servoCalibrationTaskState,
    on(SERVO_CALIBRATION_ACTIONS.startCalibration, (state): IState['servoCalibrationTaskState'] => {
        return {
            ...state,
            calibrationInProgress: true
        };
    }),
    on(SERVO_CALIBRATION_ACTIONS.calibrationFinished, (state): IState['servoCalibrationTaskState'] => {
        return {
            ...state,
            calibrationInProgress: false
        };
    }),
    on(SERVO_CALIBRATION_ACTIONS.calibrationCancelled, (state): IState['servoCalibrationTaskState'] => {
        return {
            ...state,
            calibrationInProgress: false
        };
    }),
    on(SERVO_CALIBRATION_ACTIONS.calibrationError, (state): IState['servoCalibrationTaskState'] => {
        return {
            ...state,
            calibrationInProgress: false
        };
    })
);
