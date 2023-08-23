import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

export type SetLinearSpeedTaskPayload = {
    bindingType: ControlSchemeBindingType.Linear;
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

export type SpeedStepperTaskPayload = {
    bindingType: ControlSchemeBindingType.SpeedStepper;
    nextSpeedActiveInput: boolean;
    prevSpeedActiveInput: boolean;
    speed: number;
    power: number;
    level: number;
    useAccelerationProfile: boolean;
    useDecelerationProfile: boolean;
};

export type PortCommandTaskPayload = SetLinearSpeedTaskPayload
    | ServoTaskPayload
    | SetAngleTaskPayload
    | StepperTaskPayload
    | SpeedStepperTaskPayload;

export type PortCommandTask<TPayloadType extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    hubId: string;
    portId: number;
    bindingId: string;
    payload: PortCommandTaskPayload & { bindingType: TPayloadType };
    hash: string;
    inputTimestamp: number;
};
