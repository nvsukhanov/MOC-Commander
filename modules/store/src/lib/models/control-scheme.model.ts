import { ButtonGroupButtonId, MotorServoEndState } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, WidgetType } from '@app/shared-misc';

export enum LoopingMode {
    None,
    Wrap,
    Mirror
}

export enum InputGain {
    Linear,
    Exponential,
    Logarithmic,
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

export type ControlSchemeInput = {
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    gain: InputGain;
    buttonId?: ButtonGroupButtonId;
    portId?: number;
    inputDirection: InputDirection;
};

export enum SpeedBindingInputAction {
    Forwards = 'Forwards',
    Backwards = 'Backwards',
    Brake = 'Brake'
}

export type ControlSchemeSpeedBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Speed;
    inputs: {
        [SpeedBindingInputAction.Forwards]?: ControlSchemeInput;
        [SpeedBindingInputAction.Backwards]?: ControlSchemeInput;
        [SpeedBindingInputAction.Brake]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    maxSpeed: number;
    invert: boolean;
    power: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export enum ServoBindingInputAction {
    Cw = 'Cw',
    Ccw = 'Ccw'
}

export type ControlSchemeServoBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Servo;
    inputs: {
        [ServoBindingInputAction.Cw]?: ControlSchemeInput;
        [ServoBindingInputAction.Ccw]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    calibrateOnStart: boolean;
    range: number;
    aposCenter: number;
    speed: number;
    power: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export enum SetAngleBindingInputAction {
    SetAngle = 'SetAngle'
}

export type ControlSchemeSetAngleBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.SetAngle;
    inputs: {
        [SetAngleBindingInputAction.SetAngle]: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export enum StepperBindingInputAction {
    Cw = 'Cw',
    Ccw = 'Ccw'
}

export type ControlSchemeStepperBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Stepper;
    inputs: {
        [StepperBindingInputAction.Cw]?: ControlSchemeInput;
        [StepperBindingInputAction.Ccw]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export enum TrainBindingInputAction {
    NextSpeed = 'NextSpeed',
    PrevSpeed = 'PrevSpeed',
    Reset = 'ResetSpeed'
}

export type ControlSchemeTrainBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Train;
    inputs: {
        [TrainBindingInputAction.NextSpeed]: ControlSchemeInput;
        [TrainBindingInputAction.PrevSpeed]?: ControlSchemeInput;
        [TrainBindingInputAction.Reset]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    levels: number[];
    power: number;
    loopingMode: LoopingMode;
    initialLevelIndex: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export enum GearboxBindingInputAction {
    NextGear = 'NextGear',
    PrevGear = 'PrevGear',
    Reset = 'ResetGear'
}

export type ControlSchemeGearboxBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Gearbox;
    inputs: {
        [GearboxBindingInputAction.NextGear]: ControlSchemeInput;
        [GearboxBindingInputAction.Reset]?: ControlSchemeInput;
        [GearboxBindingInputAction.PrevGear]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    angles: number[];
    speed: number;
    power: number;
    loopingMode: LoopingMode;
    endState: MotorServoEndState;
    initialLevelIndex: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeBindingInputs<T extends ControlSchemeBindingType = ControlSchemeBindingType> = (ControlSchemeBinding & { bindingType: T })['inputs'];

export type ControlSchemeBinding = ControlSchemeSpeedBinding
    | ControlSchemeServoBinding
    | ControlSchemeSetAngleBinding
    | ControlSchemeStepperBinding
    | ControlSchemeTrainBinding
    | ControlSchemeGearboxBinding;

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

export type TiltWidgetConfigModel = {
    widgetType: WidgetType.Tilt;
    hubId: string;
    portId: number;
    modeId: number;
    valueChangeThreshold: number;
    invertYaw: boolean;
    invertPitch: boolean;
    invertRoll: boolean;
} & BaseWidgetConfigModel;

export type TemperatureWidgetConfigModel = {
    widgetType: WidgetType.Temperature;
    hubId: string;
    portId: number;
    modeId: number;
    valueChangeThreshold: number;
} & BaseWidgetConfigModel;

export type WidgetConfigModel = VoltageWidgetConfigModel | TiltWidgetConfigModel | TemperatureWidgetConfigModel;

export type ControlSchemeModel = {
    name: string;
    widgets: Array<WidgetConfigModel>;
    portConfigs: ControlSchemePortConfig[];
    bindings: ControlSchemeBinding[];
};
