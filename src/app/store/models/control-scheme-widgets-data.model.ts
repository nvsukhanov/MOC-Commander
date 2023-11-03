import { TiltData } from 'rxpoweredup';
import { WidgetType } from '@app/store';

export type ControlSchemeVoltageWidgetDataModel = {
    widgetType: WidgetType.Voltage;
    voltage: number;
};

export type ControlSchemeTiltWidgetDataModel = {
    widgetType: WidgetType.Tilt;
    tilt: TiltData;
};

export type ControlSchemeTemperatureWidgetDataModel = {
    widgetType: WidgetType.Temperature;
    temperature: number;
};

export type ControlSchemeWidgetsDataModel = ControlSchemeVoltageWidgetDataModel | ControlSchemeTiltWidgetDataModel | ControlSchemeTemperatureWidgetDataModel;
