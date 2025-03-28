import { createActionGroup, props } from '@ngrx/store';

export const ATTACHED_IO_PROPS_ACTIONS = createActionGroup({
  source: 'Attached IO Props',
  events: {
    motorEncoderOffsetReceived: props<{ hubId: string; portId: number; offset: number }>(),
    startupServoCalibrationDataReceived: props<{ hubId: string; portId: number; range: number; aposCenter: number }>(),
    startupMotorPositionReceived: props<{ hubId: string; portId: number; position: number }>(),
    compensatePitch: props<{ hubId: string; portId: number; currentPitch: number }>(),
    compensateYaw: props<{ hubId: string; portId: number; currentYaw: number }>(),
    compensateRoll: props<{ hubId: string; portId: number; currentRoll: number }>(),
    resetPitchCompensation: props<{ hubId: string; portId: number }>(),
    resetYawCompensation: props<{ hubId: string; portId: number }>(),
    resetRollCompensation: props<{ hubId: string; portId: number }>(),
  },
});
