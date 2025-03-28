import { ButtonGroupButtonId, MotorServoEndState } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, WidgetType } from '@app/shared-misc';

export enum LoopingMode {
  None,
  Cycle,
  PingPong,
}

export type ControlSchemePortConfig = {
  hubId: string;
  portId: number;
  accelerationTimeMs: number;
  decelerationTimeMs: number;
};

export type AccelerationProfileMixin = {
  useAccelerationProfile: boolean;
};

export type DecelerationProfileMixin = {
  useDecelerationProfile: boolean;
};

export enum InputDirection {
  Positive,
  Negative,
}

export enum InputPipeType {
  LogarithmicGain,
  ExponentialGain,
  OnOffToggle,
  Pulse,
}

export type InputPipeLogarithmicGain = {
  type: InputPipeType.LogarithmicGain;
};

export type InputPipeExponentialGain = {
  type: InputPipeType.ExponentialGain;
};

export type InputPipeOnOffToggleConfig = {
  type: InputPipeType.OnOffToggle;
};

export type InputPipePulseConfig = {
  type: InputPipeType.Pulse;
  periodMs: number;
  dutyCycle: number; // 0.25 = 25%
};

export type InputPipeConfig = InputPipeLogarithmicGain | InputPipeExponentialGain | InputPipeOnOffToggleConfig | InputPipePulseConfig;

export type ControlSchemeInputConfig = {
  controllerId: string;
  inputId: string;
  inputType: ControllerInputType;
  buttonId?: ButtonGroupButtonId;
  portId?: number;
  inputDirection: InputDirection;
  inputPipes: InputPipeConfig[];
};

// Using string enum for input actions to avoid issues with object keys conversion to string
export enum SpeedBindingInputAction {
  Forwards = '0',
  Backwards = '1',
  Brake = '2',
}

export type ControlSchemeSpeedBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Speed;
  inputs: {
    [SpeedBindingInputAction.Forwards]?: ControlSchemeInputConfig;
    [SpeedBindingInputAction.Backwards]?: ControlSchemeInputConfig;
    [SpeedBindingInputAction.Brake]?: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  maxSpeed: number;
  invert: boolean;
  power: number;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

export enum ServoBindingInputAction {
  Cw = '0',
  Ccw = '1',
}

export type ControlSchemeServoBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Servo;
  inputs: {
    [ServoBindingInputAction.Cw]?: ControlSchemeInputConfig;
    [ServoBindingInputAction.Ccw]?: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  calibrateOnStart: boolean;
  range: number;
  aposCenter: number;
  speed: number;
  power: number;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

export enum SetAngleBindingInputAction {
  SetAngle = '0',
}

export type ControlSchemeSetAngleBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.SetAngle;
  inputs: {
    [SetAngleBindingInputAction.SetAngle]: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  angle: number;
  speed: number;
  power: number;
  endState: MotorServoEndState;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

export enum StepperBindingInputAction {
  Cw = '0',
  Ccw = '1',
}

export type ControlSchemeStepperBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Stepper;
  inputs: {
    [StepperBindingInputAction.Cw]?: ControlSchemeInputConfig;
    [StepperBindingInputAction.Ccw]?: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  degree: number;
  speed: number;
  power: number;
  endState: MotorServoEndState;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

export enum TrainBindingInputAction {
  NextSpeed = '0',
  PrevSpeed = '1',
  Reset = '2',
}

export type ControlSchemeTrainBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Train;
  inputs: {
    [TrainBindingInputAction.NextSpeed]: ControlSchemeInputConfig;
    [TrainBindingInputAction.PrevSpeed]?: ControlSchemeInputConfig;
    [TrainBindingInputAction.Reset]?: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  levels: number[];
  power: number;
  loopingMode: LoopingMode;
  initialLevelIndex: number;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

export enum GearboxBindingInputAction {
  NextGear = '0',
  PrevGear = '1',
  Reset = '2',
}

export type ControlSchemeGearboxBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Gearbox;
  inputs: {
    [GearboxBindingInputAction.NextGear]: ControlSchemeInputConfig;
    [GearboxBindingInputAction.Reset]?: ControlSchemeInputConfig;
    [GearboxBindingInputAction.PrevGear]?: ControlSchemeInputConfig;
  };
  hubId: string;
  portId: number;
  angles: number[];
  speed: number;
  power: number;
  loopingMode: LoopingMode;
  endState: MotorServoEndState;
  initialLevelIndex: number;
} & AccelerationProfileMixin &
  DecelerationProfileMixin;

// Using string enum for input actions to avoid issues with object keys conversion to string
export enum AccelerateBindingInputAction {
  Forwards = '0',
  Backwards = '1',
  Decelerate = '2',
}

export type ControlSchemeAccelerateBinding = {
  id: number;
  bindingType: ControlSchemeBindingType.Accelerate;
  inputs: {
    [AccelerateBindingInputAction.Forwards]?: ControlSchemeInputConfig;
    [AccelerateBindingInputAction.Backwards]?: ControlSchemeInputConfig;
    [AccelerateBindingInputAction.Decelerate]?: ControlSchemeInputConfig;
  };
  forwardsSpeedIncrement: number;
  backwardsSpeedIncrement: number;
  decelerateSpeedDecrement: number;
  hubId: string;
  portId: number;
  maxSpeed: number;
  invert: boolean;
  power: number;
};

export type ControlSchemeBinding =
  | ControlSchemeSpeedBinding
  | ControlSchemeServoBinding
  | ControlSchemeSetAngleBinding
  | ControlSchemeStepperBinding
  | ControlSchemeTrainBinding
  | ControlSchemeGearboxBinding
  | ControlSchemeAccelerateBinding;

export type ControlSchemeBindingInputs<T extends ControlSchemeBindingType = ControlSchemeBindingType> = (ControlSchemeBinding & { bindingType: T })['inputs'];

export type BaseWidgetConfigModel = {
  id: number;
  title: string;
  width: number;
  height: number;
};

export type VoltageWidgetConfigModel = {
  widgetType: WidgetType.Voltage;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
} & BaseWidgetConfigModel;

export type YawWidgetConfigModel = {
  widgetType: WidgetType.Yaw;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
  invert: boolean;
} & BaseWidgetConfigModel;

export type PitchWidgetConfigModel = {
  widgetType: WidgetType.Pitch;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
  invert: boolean;
} & BaseWidgetConfigModel;

export type RollWidgetConfigModel = {
  widgetType: WidgetType.Roll;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
  invert: boolean;
} & BaseWidgetConfigModel;

export type TemperatureWidgetConfigModel = {
  widgetType: WidgetType.Temperature;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
} & BaseWidgetConfigModel;

export type WidgetConfigModel = VoltageWidgetConfigModel | TemperatureWidgetConfigModel | PitchWidgetConfigModel | YawWidgetConfigModel | RollWidgetConfigModel;

export type ControlSchemeModel = {
  name: string;
  widgets: Array<WidgetConfigModel>;
  portConfigs: ControlSchemePortConfig[];
  bindings: ControlSchemeBinding[];
};
