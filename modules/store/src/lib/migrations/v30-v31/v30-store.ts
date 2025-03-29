import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { SetAngleBindingInputAction } from '../../models';
import { AppStoreVersion } from '../../app-store-version';
import { V31Store } from '../v31-v32';

export type V31ControlSchemesEntitiesState = ExtractEntitiesType<V31Store['controlSchemes']>;
export type V31Binding = ExtractArrayType<V31ControlSchemesEntitiesState['bindings']>;
export type V31SpeedBinding = V31Binding & { bindingType: ControlSchemeBindingType.Speed };
export type V31ServoBinding = V31Binding & { bindingType: ControlSchemeBindingType.Servo };
export type V31StepperBinding = V31Binding & { bindingType: ControlSchemeBindingType.Stepper };
export type V31TrainBinding = V31Binding & { bindingType: ControlSchemeBindingType.Train };
export type V31GearboxBinding = V31Binding & { bindingType: ControlSchemeBindingType.Gearbox };
export type V31SetAngleBinding = V31Binding & { bindingType: ControlSchemeBindingType.SetAngle };

export type V31InputConfig = V31SetAngleBinding['inputs'][SetAngleBindingInputAction.SetAngle];

export const OLD_TITLE_WIDGET_TYPE = 1;

export type OldTiltWidgetConfigModel = {
  widgetType: number;
  hubId: string;
  portId: number;
  modeId: number;
  valueChangeThreshold: number;
  invertYaw: boolean;
  invertPitch: boolean;
  invertRoll: boolean;
  id: number;
  title: string;
  width: number;
  height: number;
};

export type V31WidgetConfigModel = ExtractArrayType<V31ControlSchemesEntitiesState['widgets']>;
export type V30WidgetConfigModel = V31WidgetConfigModel | OldTiltWidgetConfigModel;

export enum OldInputGain {
  Linear,
  Exponential,
  Logarithmic,
}

export type V30InputConfig = Override<
  Omit<V31InputConfig, 'inputPipes'>,
  {
    gain: OldInputGain;
  }
>;

export type V30BindingInputs<T> = {
  [P in keyof T]: V30InputConfig;
};

export type V30SpeedBinding = Override<
  V31SpeedBinding,
  {
    inputs: V30BindingInputs<V31SpeedBinding['inputs']>;
  }
>;

export type V30ServoBinding = Override<
  V31ServoBinding,
  {
    inputs: V30BindingInputs<V31ServoBinding['inputs']>;
  }
>;

export type V30SetAngleBinding = Override<
  V31SetAngleBinding,
  {
    inputs: V30BindingInputs<V31SetAngleBinding['inputs']>;
  }
>;

export type V30StepperBinding = Override<
  V31StepperBinding,
  {
    inputs: V30BindingInputs<V31StepperBinding['inputs']>;
  }
>;

export type V30TrainBinding = Override<
  V31TrainBinding,
  {
    inputs: V30BindingInputs<V31TrainBinding['inputs']>;
  }
>;

export type V30GearboxBinding = Override<
  V31GearboxBinding,
  {
    inputs: V30BindingInputs<V31GearboxBinding['inputs']>;
  }
>;

export type V30Bindings =
  | V30SpeedBinding
  | V30ServoBinding
  | V30StepperBinding
  | V30TrainBinding
  | V30GearboxBinding
  | V30SetAngleBinding;

export type V30ControlSchemesEntitiesState = Omit<V31ControlSchemesEntitiesState, 'bindings' | 'widgets'> & {
  bindings: V30Bindings[];
  widgets: V30WidgetConfigModel[];
};

export type V30Store = Override<
  V31Store,
  {
    controlSchemes: Omit<V31Store['controlSchemes'], 'entities'> & EntityState<V30ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v30;
  }
>;
