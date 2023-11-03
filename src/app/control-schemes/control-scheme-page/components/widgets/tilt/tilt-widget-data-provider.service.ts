import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TiltData } from 'rxpoweredup';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_ACTIONS, CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, TiltWidgetConfigModel } from '@app/store';

@Injectable()
export class TiltWidgetDataProviderService {
    constructor(
        private readonly store: Store
    ) {
    }

    public getTilt(
        widgetConfig: TiltWidgetConfigModel
    ): Observable<TiltData | undefined> {
        return this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectWidgetTiltData(widgetConfig));
    }

    public compensateTilt(
        hubId: string,
        portId: number,
        compensationData: TiltData
    ): void {
        this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.compensateTilt({
            hubId,
            portId,
            compensationData
        }));
    }

    public resetTiltCompensation(
        hubId: string,
        portId: number,
    ): void {
        this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.resetTiltCompensation({ hubId, portId }));
    }
}
