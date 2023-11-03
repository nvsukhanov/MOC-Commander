import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, WidgetType } from '@app/store';

@Injectable({ providedIn: 'root' })
export class TemperatureWidgetDataProviderService {
    constructor(
        private readonly store: Store
    ) {
    }

    public getTemperature(
        widgetId: number
    ): Observable<number | null> {
        return this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(widgetId)).pipe(
            // eslint-disable-next-line @ngrx/avoid-mapping-selectors
            map((widgetData) => {
                if (widgetData?.widgetType === WidgetType.Temperature) {
                    return widgetData.temperature;
                }
                return null;
            })
        );
    }
}
