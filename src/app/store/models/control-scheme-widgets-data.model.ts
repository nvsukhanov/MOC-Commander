import { WidgetType } from '@app/store';

export type ControlSchemeVoltageWidgetDataModel = {
    widgetType: WidgetType.Voltage;
    voltage: number;
};

export type ControlSchemeWidgetsDataModel = {
    widgetIndex: number;
} & ControlSchemeVoltageWidgetDataModel;
