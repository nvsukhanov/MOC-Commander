import { Observable } from 'rxjs';
import { TiltData } from 'rxpoweredup';
import { InjectionToken } from '@angular/core';
import { TiltWidgetConfigModel } from '@app/store';

export interface ITiltSensorWidgetDataProvider {
    getTilt(widgetConfig: TiltWidgetConfigModel): Observable<TiltData | undefined>;

    compensateTilt(hubId: string, portId: number, compensationData: TiltData): void;

    resetTiltCompensation(hubId: string, portId: number): void;
}

export const TILT_SENSOR_WIDGET_DATA_PROVIDER = new InjectionToken<ITiltSensorWidgetDataProvider>('TILT_SENSOR_WIDGET_DATA_PROVIDER');
