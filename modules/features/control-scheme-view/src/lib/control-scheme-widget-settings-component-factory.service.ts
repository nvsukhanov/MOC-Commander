import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

import { ControlSchemeWidgetSettingsDescriptor, IControlSchemeWidgetSettingsComponentFactory } from './widget-settings-container';
import {
    TemperatureWidgetSettingsComponentFactoryService,
    TiltWidgetSettingsComponentFactoryService,
    VoltageWidgetSettingsComponentFactoryService
} from './widgets';

@Injectable()
export class ControlSchemeWidgetSettingsComponentFactoryService implements IControlSchemeWidgetSettingsComponentFactory<WidgetType> {
    constructor(
        private readonly temperatureWidgetSettingsComponentFactoryService: TemperatureWidgetSettingsComponentFactoryService,
        private readonly tiltWidgetSettingsComponentFactoryService: TiltWidgetSettingsComponentFactoryService,
        private readonly voltageWidgetSettingsComponentFactoryService: VoltageWidgetSettingsComponentFactoryService
    ) {
    }

    public hasSettings(widgetType: WidgetType): boolean {
        switch (widgetType) {
            case WidgetType.Temperature:
            case WidgetType.Tilt:
            case WidgetType.Voltage:
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
            case WidgetType.Tilt:
                return this.tiltWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
            case WidgetType.Voltage:
                return this.voltageWidgetSettingsComponentFactoryService.createWidgetSettings(container, config);
        }
    }
}