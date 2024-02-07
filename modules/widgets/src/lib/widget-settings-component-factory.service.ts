import { Injectable, ViewContainerRef } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { ControlSchemeWidgetSettingsDescriptor, IControlSchemeWidgetSettingsComponentFactory } from '@app/control-scheme-view';
import { WidgetConfigModel } from '@app/store';

import { TemperatureWidgetSettingsComponentFactoryService } from './temperature';
import { TiltWidgetSettingsComponentFactoryService } from './tilt';
import { VoltageWidgetSettingsComponentFactoryService } from './voltage';

@Injectable()
export class WidgetSettingsComponentFactoryService implements IControlSchemeWidgetSettingsComponentFactory<WidgetType> {
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