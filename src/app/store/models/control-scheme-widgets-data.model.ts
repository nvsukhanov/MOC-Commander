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

export type ControlSchemeWidgetsDataModel = ControlSchemeVoltageWidgetDataModel | ControlSchemeTiltWidgetDataModel;
