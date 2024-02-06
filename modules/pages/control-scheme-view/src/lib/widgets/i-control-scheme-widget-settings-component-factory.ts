import { InjectionToken, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

export type ControlSchemeWidgetSettingsDescriptor = {
    readonly config: WidgetConfigModel | undefined;
    configChanges$: Observable<WidgetConfigModel | undefined>;
    destroy: () => void;
};

export interface IControlSchemeWidgetSettingsComponentFactory<T extends WidgetType = WidgetType> {
    createWidgetSettings(
        container: ViewContainerRef,
        config: WidgetConfigModel & { widgetType: T }
    ): ControlSchemeWidgetSettingsDescriptor;

    hasSettings(widgetType: WidgetType): boolean;
}

export const CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY =
    new InjectionToken<IControlSchemeWidgetSettingsComponentFactory<WidgetType>>('CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY');
