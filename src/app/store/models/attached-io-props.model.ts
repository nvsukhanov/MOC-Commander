import { TiltData } from 'rxpoweredup';

export type AttachedIoPropsModel = {
    hubId: string;
    portId: number;
    motorEncoderOffset: number | null;
    startupServoCalibrationData: {
        range: number;
        aposCenter: number;
    } | null;
    runtimeTiltCompensation: TiltData | null;
};
