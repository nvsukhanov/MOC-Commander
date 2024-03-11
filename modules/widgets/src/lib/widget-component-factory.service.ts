import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor, IControlSchemeWidgetComponentFactory } from '@app/control-scheme-view';

import { TemperatureWidgetComponentFactoryService } from './temperature';
import { VoltageWidgetComponentFactoryService } from './voltage';
import { PitchWidgetComponentFactoryService } from './pitch';
import { YawWidgetComponentFactoryService } from './yaw';
import { RollWidgetComponentFactoryService } from './roll';

@Injectable()
export class WidgetComponentFactoryService implements IControlSchemeWidgetComponentFactory<WidgetType> {
    constructor(
        private readonly temperatureWidgetFactory: TemperatureWidgetComponentFactoryService,
        private readonly voltageWidgetFactory: VoltageWidgetComponentFactoryService,
        private readonly pitchWidgetFactory: PitchWidgetComponentFactoryService,
        private readonly yawWidgetFactory: YawWidgetComponentFactoryService,
        private readonly rollWidgetFactory: RollWidgetComponentFactoryService
    ) {
    }

    public createWidget(
        container: ViewContainerRef,
        config: WidgetConfigModel
    ): ControlSchemeWidgetDescriptor {
        switch (config.widgetType) {
            case WidgetType.Temperature:
                return this.temperatureWidgetFactory.createWidget(container, config);
            case WidgetType.Voltage:
                return this.voltageWidgetFactory.createWidget(container, config);
            case WidgetType.Pitch:
                return this.pitchWidgetFactory.createWidget(container, config);
            case WidgetType.Yaw:
                return this.yawWidgetFactory.createWidget(container, config);
            case WidgetType.Roll:
                return this.rollWidgetFactory.createWidget(container, config);
        }
    }
}
