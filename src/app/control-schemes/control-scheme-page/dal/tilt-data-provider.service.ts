import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { TiltData } from 'rxpoweredup';

import { ITiltSensorWidgetDataProvider } from '../components';

@Injectable()
export class TiltDataProviderService implements ITiltSensorWidgetDataProvider {
    public getTilt(): Observable<TiltData | null> {
        return interval(100).pipe(
            map((v) => Math.round(Math.sin(v / 100) * 360)),
            map((v) => ({ pitch: v, yaw: v, roll: v }))
        );
    }
}
