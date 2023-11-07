import { Injectable } from '@angular/core';
import { PortModeName } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { WidgetType } from '@app/shared';
import { AttachedIoModel, WidgetConfigModel, attachedIosIdFn } from '@app/store';

import { TemperatureWidgetConfigFactoryService, TiltWidgetConfigFactoryService, VoltageWidgetConfigFactoryService } from './widgets';
import { SchemeRunBlocker } from './types';

@Injectable({ providedIn: 'root' })
export class ControlSchemeStartBlockerWidgetsService {
    constructor(
        private readonly voltageWidgetConfigFactoryService: VoltageWidgetConfigFactoryService,
        private readonly tiltWidgetConfigFactoryService: TiltWidgetConfigFactoryService,
        private readonly temperatureWidgetConfigFactoryService: TemperatureWidgetConfigFactoryService,
    ) {
    }

    public getBlockers(
        widgetConfig: WidgetConfigModel,
        attachedIos: Dictionary<AttachedIoModel>,
        portInputModes: Dictionary<PortModeName[]>
    ): SchemeRunBlocker[] {
        const result: SchemeRunBlocker[] = [];
        let necessaryModesPresent = false;
        let attachedIosPresent = false;
        switch (widgetConfig.widgetType) {
            case WidgetType.Temperature:
                attachedIosPresent = attachedIos[attachedIosIdFn(widgetConfig)] !== undefined;
                necessaryModesPresent = this.temperatureWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? []);
                break;
            case WidgetType.Tilt:
                attachedIosPresent = attachedIos[attachedIosIdFn(widgetConfig)] !== undefined;
                necessaryModesPresent = this.tiltWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? []);
                break;
            case WidgetType.Voltage:
                attachedIosPresent = attachedIos[attachedIosIdFn(widgetConfig)] !== undefined;
                necessaryModesPresent = this.voltageWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? []);
                break;
        }
        if (!necessaryModesPresent) {
            result.push(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }
        if (!attachedIosPresent) {
            result.push(SchemeRunBlocker.SomeIosAreNotConnected);
        }
        return result;
    }
}
