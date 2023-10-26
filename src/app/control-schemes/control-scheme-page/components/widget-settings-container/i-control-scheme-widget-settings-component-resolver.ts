import { InjectionToken, Type } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

import { IControlSchemeWidgetSettingsComponent } from './i-control-scheme-widget-settings-component';

export type ControlSchemeWidgetSettingsComponentOfType<T extends WidgetType> = IControlSchemeWidgetSettingsComponent<
    WidgetConfigModel & { widgetType: T }
>;

export interface IControlSchemeWidgetSettingsComponentResolver {
    resolveWidgetSettings<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetSettingsComponentOfType<T>> | undefined;
}

export const CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER =
    new InjectionToken<IControlSchemeWidgetSettingsComponentResolver>('CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER');
