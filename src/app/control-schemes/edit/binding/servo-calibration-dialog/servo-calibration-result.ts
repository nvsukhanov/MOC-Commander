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
