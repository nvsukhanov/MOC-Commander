import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, WidgetType } from '@app/store';

import { IVoltageWidgetDataProvider } from '../components';

@Injectable()
export class VoltageDataProviderService implements IVoltageWidgetDataProvider {
    constructor(
        private readonly store: Store
    ) {
    }

    public getVoltage(
        widgetId: number
    ): Observable<number | null> {
        return this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(widgetId)).pipe(
            // I don't want to make widget-specific data selectors, so I have to filter here
            // eslint-disable-next-line @ngrx/avoid-mapping-selectors
            map((widgetData) => {
                if (widgetData?.widgetType === WidgetType.Voltage) {
                    return widgetData.voltage;
                }
                return null;
            })
        );
    }
}
