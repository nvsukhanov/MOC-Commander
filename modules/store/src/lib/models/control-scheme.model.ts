import { ButtonGroupButtonId, MotorServoEndState } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, WidgetType } from '@app/shared-misc';

export enum LoopingMode {
    None,
    Wrap,
    Mirror
}

export enum InputGain {
    None,
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

export type ControlSchemeInput = {
    controllerId: string;
    inputId: string;
    inputType: ControllerInputType;
    gain: InputGain;
    buttonId?: ButtonGroupButtonId;
    portId?: number;
};

export enum ControlSchemeInputAction {
    Accelerate,
    Brake,
    Servo,
    SetAngle,
    Step,
    NextLevel,
    PrevLevel,
    Reset,
}

export type ControlSchemeSetSpeedBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.SetSpeed;
    inputs: {
        [ControlSchemeInputAction.Accelerate]: ControlSchemeInput;
        [ControlSchemeInputAction.Brake]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    maxSpeed: number;
    invert: boolean;
    power: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeServoBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Servo;
    inputs: {
        [ControlSchemeInputAction.Servo]: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    calibrateOnStart: boolean;
    range: number;
    aposCenter: number;
    speed: number;
    power: number;
    invert: boolean;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeSetAngleBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.SetAngle;
    inputs: {
        [ControlSchemeInputAction.SetAngle]: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    angle: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeStepperBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.Stepper;
    inputs: {
        [ControlSchemeInputAction.Step]: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    degree: number;
    speed: number;
    power: number;
    endState: MotorServoEndState;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeTrainControlBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.TrainControl;
    inputs: {
        [ControlSchemeInputAction.NextLevel]: ControlSchemeInput;
        [ControlSchemeInputAction.PrevLevel]?: ControlSchemeInput;
        [ControlSchemeInputAction.Reset]?: ControlSchemeInput;
    };
    hubId: string;
    portId: number;
    levels: number[];
    power: number;
    loopingMode: LoopingMode;
    initialLevelIndex: number;
} & AccelerationProfileMixin & DecelerationProfileMixin;

export type ControlSchemeGearboxControlBinding = {
    id: number;
    bindingType: ControlSchemeBindingType.GearboxControl;
    inputs: {
        [ControlSchemeInputAction.NextLevel]: ControlSchemeInput;
        [ControlSchemeInputAction.Reset]?: ControlSchemeInput;
        [ControlSchemeInputAction.PrevLevel]?: ControlSchemeInput;
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

export type ControlSchemeBinding = ControlSchemeSetSpeedBinding
    | ControlSchemeServoBinding
    | ControlSchemeSetAngleBinding
    | ControlSchemeStepperBinding
    | ControlSchemeTrainControlBinding
    | ControlSchemeGearboxControlBinding;

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
