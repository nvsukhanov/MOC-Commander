import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IVoltageSensorWidgetDataProvider {
    getVoltage(widgetId: number): Observable<number | null>;
}

export const VOLTAGE_SENSOR_WIDGET_DATA_PROVIDER = new InjectionToken<IVoltageSensorWidgetDataProvider>('VOLTAGE_SENSOR_WIDGET_DATA_PROVIDER');
