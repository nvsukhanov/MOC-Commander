import { InjectionToken } from '@angular/core';
import { WidgetType } from '@app/store';

export interface IAvailableWidgetTypesProvider {
    getAvailableWidgetTypes(
        controlSchemeName: string
    ): WidgetType[];
}

export const AVAILABLE_WIDGET_TYPE_PROVIDER = new InjectionToken<IAvailableWidgetTypesProvider>('AVAILABLE_WIDGET_TYPE_PROVIDER');
