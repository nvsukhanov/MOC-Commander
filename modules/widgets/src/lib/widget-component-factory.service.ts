import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor, IControlSchemeWidgetComponentFactory } from '@app/control-scheme-view';

import { TemperatureWidgetComponentFactoryService } from './temperature';
import { TiltWidgetComponentFactoryService } from './tilt';
import { VoltageWidgetComponentFactoryService } from './voltage';

@Injectable()
export class WidgetComponentFactoryService implements IControlSchemeWidgetComponentFactory<WidgetType> {
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
