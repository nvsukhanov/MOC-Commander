import { MotorServoEndState } from 'rxpoweredup';

import { StepperBindingInputAction } from './control-scheme.model';

export enum TaskType {
  Speed,
  SetAngle,
  Stepper,
  Train,
  Gearbox,
}

export type SpeedTaskPayload = {
  type: TaskType.Speed;
  speed: number;
  brakeFactor: number; // [0 to MOTOR_LIMITS.MAX_SPEED]
  power: number;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
};

export type ServoTaskPayload = {
  type: TaskType.SetAngle;
  angle: number;
  speed: number;
  power: number;
  endState: MotorServoEndState;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
};

export type SetAngleTaskPayload = {
  type: TaskType.SetAngle;
  angle: number;
  speed: number;
  power: number;
  endState: MotorServoEndState;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
};

export type StepperTaskPayload = {
  type: TaskType.Stepper;
  degree: number;
  speed: number;
  power: number;
  endState: MotorServoEndState;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
  action: StepperBindingInputAction;
};

export type TrainTaskPayload = {
  type: TaskType.Train;
  speed: number;
  power: number;
  initialLevelIndex: number;
  speedIndex: number;
  isLooping: boolean;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
};

export type GearboxTaskPayload = {
  type: TaskType.Gearbox;
  offset: number;
  angle: number;
  initialLevelIndex: number;
  power: number;
  speed: number;
  angleIndex: number;
  isLooping: boolean;
  endState: MotorServoEndState;
  useAccelerationProfile: boolean;
  useDecelerationProfile: boolean;
};

export type PortCommandTaskPayload = SpeedTaskPayload | ServoTaskPayload | SetAngleTaskPayload | StepperTaskPayload | TrainTaskPayload | GearboxTaskPayload;

export type PortCommandTask<TTaskType extends TaskType = TaskType> = {
  hubId: string;
  portId: number;
  payload: PortCommandTaskPayload & { type: TTaskType };
  inputTimestamp: number;
};
