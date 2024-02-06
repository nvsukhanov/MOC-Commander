import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeWidgetsDataModel, HubStorageService, IWidgetReadTaskFactory, WidgetConfigModel } from '@app/store';
import { WidgetType } from '@app/shared-misc';

import { TemperatureWidgetReadTaskFactoryService } from './temperature';
import { TiltWidgetReadTaskFactoryService } from './tilt';
import { VoltageWidgetReadTaskFactoryService } from './voltage';

@Injectable()
export class WidgetReadTaskFactoryService implements IWidgetReadTaskFactory {
    private readonly widgetReaderTaskFactories: { [k in WidgetType]: IWidgetReadTaskFactory<WidgetConfigModel & { widgetType: k }> } = {
        [WidgetType.Temperature]: this.temperatureWidgetReadTaskFactoryService,
        [WidgetType.Tilt]: this.tiltWidgetReadTaskFactoryService,
        [WidgetType.Voltage]: this.voltageWidgetReadTaskFactoryService
    };

    constructor(
        private readonly temperatureWidgetReadTaskFactoryService: TemperatureWidgetReadTaskFactoryService,
        private readonly tiltWidgetReadTaskFactoryService: TiltWidgetReadTaskFactoryService,
        private readonly voltageWidgetReadTaskFactoryService: VoltageWidgetReadTaskFactoryService
    ) {
    }

    public createReadTask<T extends WidgetType>(
        config: WidgetConfigModel & { widgetType: T },
        store: Store,
        hubStorage: HubStorageService,
        schemeStop$: Observable<unknown>
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        const widgetType: T = config.widgetType;
        const readerTaskFactory = this.widgetReaderTaskFactories[widgetType];
        return readerTaskFactory.createReadTask(
            config,
            store,
            hubStorage,
            schemeStop$
        );
    }
}
