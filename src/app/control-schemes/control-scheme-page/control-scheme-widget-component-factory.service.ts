import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

import {
    ControlSchemeWidgetDescriptor,
    IControlSchemeWidgetComponentFactory,
    TemperatureWidgetComponentFactoryService,
    TiltWidgetComponentFactoryService,
    VoltageWidgetComponentFactoryService
} from './components';

@Injectable()
export class ControlSchemeWidgetComponentFactoryService implements IControlSchemeWidgetComponentFactory<WidgetType> {
    constructor(
        private readonly temperatureWidgetFactory: TemperatureWidgetComponentFactoryService,
        private readonly tiltWidgetFactory: TiltWidgetComponentFactoryService,
        private readonly voltageWidgetFactory: VoltageWidgetComponentFactoryService
    ) {
    }

    public createWidget(
        container: ViewContainerRef,
        config: WidgetConfigModel
    ): ControlSchemeWidgetDescriptor {
        switch (config.widgetType) {
            case WidgetType.Temperature:
                return this.temperatureWidgetFactory.createWidget(container, config);
            case WidgetType.Tilt:
                return this.tiltWidgetFactory.createWidget(container, config);
            case WidgetType.Voltage:
                return this.voltageWidgetFactory.createWidget(container, config);
        }
    }
}
