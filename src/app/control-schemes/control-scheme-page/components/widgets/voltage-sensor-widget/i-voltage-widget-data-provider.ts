import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IVoltageWidgetDataProvider {
    getVoltage(widgetIndex: number): Observable<number | null>;
}

export const VOLTAGE_WIDGET_DATA_PROVIDER = new InjectionToken<IVoltageWidgetDataProvider>('VOLTAGE_WIDGET_DATA_PROVIDER');
