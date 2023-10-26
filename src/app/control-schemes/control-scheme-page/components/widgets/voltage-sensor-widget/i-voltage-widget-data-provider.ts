import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IVoltageWidgetDataProvider {
    getVoltage(hubId: string, portId: number): Observable<number>;
}

export const VOLTAGE_WIDGET_DATA_PROVIDER = new InjectionToken<IVoltageWidgetDataProvider>('VOLTAGE_WIDGET_DATA_PROVIDER');
