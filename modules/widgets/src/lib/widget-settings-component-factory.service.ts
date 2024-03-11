import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { ControlSchemeWidgetSettingsDescriptor, IControlSchemeWidgetSettingsComponentFactory } from '@app/control-scheme-view';
import { WidgetConfigModel } from '@app/store';

import { TemperatureWidgetSettingsComponentFactoryService } from './temperature';
import { VoltageWidgetSettingsComponentFactoryService } from './voltage';
import { CommonTiltWidgetsSettingsComponentFactoryService } from './common';

@Injectable()
export class WidgetSettingsComponentFactoryService implements IControlSchemeWidgetSettingsComponentFactory<WidgetType> {
    constructor(
        private readonly temperatureWidgetSettingsComponentFactoryService: TemperatureWidgetSettingsComponentFactoryService,
        private readonly voltageWidgetSettingsComponentFactoryService: VoltageWidgetSettingsComponentFactoryService,
        private readonly commonTiltWidgetSettingsComponentFactoryService: CommonTiltWidgetsSettingsComponentFactoryService
    ) {
    }

    public hasSettings(widgetType: WidgetType): boolean {
        switch (widgetType) {
            case WidgetType.Temperature:
            case WidgetType.Voltage:
            case WidgetType.Pitch:
            case WidgetType.Yaw:
            case WidgetType.Roll:
                return true;
        }
    }

    public createWidgetSettings(
        container: ViewContainerRef,
        config: WidgetConfigModel
    ): ControlSchemeWidgetSettingsDescriptor {
        switch (config.widgetType) {
            case WidgetType.Temperature:
                return this.temperatureWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
            case WidgetType.Voltage:
                return this.voltageWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
            case WidgetType.Pitch:
                return this.commonTiltWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
            case WidgetType.Yaw:
                return this.commonTiltWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
            case WidgetType.Roll:
                return this.commonTiltWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
        }
    }
}
