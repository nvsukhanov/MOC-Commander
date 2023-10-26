import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WidgetType } from '@app/store';

import { AddWidgetDialogViewModel } from '../components/add-widget-dialog/add-widget-dialog-view-model';

@Injectable()
export class AddWidgetDialogViewModelProvider {
    public getAddWidgetDialogViewModel(
        controlSchemeName: string
    ): Observable<AddWidgetDialogViewModel> {
        return of({
            controlSchemeName,
            widgets: [
                {
                    widgetType: WidgetType.Voltage,
                    hubId: 'a',
                    portId: 1,
                    modeId: 1,
                    name: 'foo',
                    valueChangeThreshold: 0.05
                }
            ]
        });
    }
}
