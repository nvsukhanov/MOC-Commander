import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { WidgetType } from '@app/shared-misc';

export interface IWidgetConnectionInfoProvider {
  getConnectionInfo(widgetType: WidgetType, hubId: string, portId: number): Observable<string>;
}

export const WIDGET_CONNECTION_INFO_PROVIDER = new InjectionToken<IWidgetConnectionInfoProvider>('WIDGET_CONNECTION_INFO_PROVIDER');
