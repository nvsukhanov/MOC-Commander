import { TiltData } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';

export type ControlSchemeVoltageWidgetDataModel = {
  widgetType: WidgetType.Voltage;
  voltage: number;
};

export type ControlSchemeTiltWidgetDataModel = {
  widgetType: WidgetType.Yaw | WidgetType.Roll | WidgetType.Pitch;
  tilt: TiltData;
};

export type ControlSchemeTemperatureWidgetDataModel = {
  widgetType: WidgetType.Temperature;
  temperature: number;
};

export type ControlSchemeWidgetsDataModel =
  | ControlSchemeVoltageWidgetDataModel
  | ControlSchemeTiltWidgetDataModel
  | ControlSchemeTemperatureWidgetDataModel;
