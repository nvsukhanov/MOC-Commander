import { Observable } from 'rxjs';
import { TiltData } from 'rxpoweredup';
import { InjectionToken } from '@angular/core';

export interface ITiltSensorWidgetDataProvider {
    getTilt(widgetId: number): Observable<TiltData | undefined>;
}

export const TILT_SENSOR_WIDGET_DATA_PROVIDER = new InjectionToken<ITiltSensorWidgetDataProvider>('TILT_SENSOR_WIDGET_DATA_PROVIDER');
