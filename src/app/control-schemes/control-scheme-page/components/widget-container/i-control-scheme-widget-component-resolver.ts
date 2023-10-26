import { InjectionToken, Type } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

import { IControlSchemeWidgetComponent } from './i-control-scheme-widget-component';

export type ControlSchemeWidgetComponentOfType<T extends WidgetType> = IControlSchemeWidgetComponent<
    WidgetConfigModel & { widgetType: T }
>;

export interface IControlSchemeWidgetComponentResolver {
    resolveWidget<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetComponentOfType<T>> | undefined;
}

export const CONTROL_SCHEME_WIDGET_COMPONENT_RESOLVER = new InjectionToken<IControlSchemeWidgetComponentResolver>('CONTROL_SCHEME_WIDGET_RESOLVER');
