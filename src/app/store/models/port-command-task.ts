import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

export type SetSpeedTaskPayload = {
    bindingType: ControlSchemeBindingType.SetSpeed;
    activeInput: boolean;
    speed: number;
    power: number;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type ServoTaskPayload = {
    bindingType: ControlSchemeBindingType.Servo;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type SetAngleTaskPayload = {
    bindingType: ControlSchemeBindingType.SetAngle;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type StepperTaskPayload = {
    bindingType: ControlSchemeBindingType.Stepper;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type SpeedShiftTaskPayload = {
    bindingType: ControlSchemeBindingType.SpeedShift;
    nextSpeedActiveInput: boolean;
    prevSpeedActiveInput: boolean;
    speed: number;
    power: number;
    speedIndex: number;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type AngleShiftTaskPayload = {
    bindingType: ControlSchemeBindingType.AngleShift;
    nextAngleActiveInput: boolean;
    prevAngleActiveInput: boolean;
    offset: number;
    angle: number;
    power: number;
    speed: number;
    angleIndex: number;
    endState: MotorServoEndState;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type PortCommandTaskPayload = SetSpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload
    | SpeedShiftTaskPayload
    | AngleShiftTaskPayload;

export type PortCommandTask<TPayloadType extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    hubId: string;
    portId: number;
    bindingId: string;
    payload: PortCommandTaskPayload & { bindingType: TPayloadType };
    hash: string;
    inputTimestamp: number;
};
