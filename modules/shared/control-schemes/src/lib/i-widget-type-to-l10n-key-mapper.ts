import { InjectionToken } from '@angular/core';
import { WidgetType } from '@app/shared-misc';

export interface IWidgetTypeToL10nKeyMapper {
    map(widgetType: WidgetType): string;
}

export const WIDGET_TYPE_TO_L10N_KEY_MAPPER = new InjectionToken<IWidgetTypeToL10nKeyMapper>('WIDGET_TYPE_TO_L10N_KEY_MAPPER');
