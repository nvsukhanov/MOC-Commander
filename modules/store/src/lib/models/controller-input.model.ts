import { ButtonGroupButtonId } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';

export type ButtonInputModel = {
  controllerId: string;
  inputType: ControllerInputType.Button;
  inputId: string;
  rawValue: number;
  timestamp: number;
};

export type ButtonGroupInputModel = {
  controllerId: string;
  inputType: ControllerInputType.ButtonGroup;
  inputId: string;
  portId: number;
  buttonId: ButtonGroupButtonId;
  rawValue: number;
  timestamp: number;
};

export type AxisInputModel = {
  controllerId: string;
  inputType: ControllerInputType.Axis;
  inputId: string;
  rawValue: number;
  timestamp: number;
};

export type TriggerInputModel = {
  controllerId: string;
  inputType: ControllerInputType.Trigger;
  inputId: string;
  rawValue: number;
  timestamp: number;
};

export type ControllerInputModel = ButtonInputModel | ButtonGroupInputModel | AxisInputModel | TriggerInputModel;
