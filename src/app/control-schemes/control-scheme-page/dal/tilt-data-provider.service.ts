import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TiltData } from 'rxpoweredup';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, WidgetType } from '@app/store';

import { ITiltSensorWidgetDataProvider } from '../components';

@Injectable()
export class TiltDataProviderService implements ITiltSensorWidgetDataProvider {
    constructor(
        private readonly store: Store
    ) {
    }

    public getTilt(
        widgetId: number
    ): Observable<TiltData | undefined> {
        return this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(widgetId)).pipe(
            // I don't want to make widget-specific data selectors, so I have to filter here
            // eslint-disable-next-line @ngrx/avoid-mapping-selectors
            map((widgetData) => {
                if (widgetData?.widgetType === WidgetType.Tilt) {
                    return widgetData.tilt;
                }
                return undefined;
            })
        );
    }
}
