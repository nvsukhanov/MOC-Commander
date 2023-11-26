import { Injectable } from '@angular/core';
import { PortModeName } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { WidgetType } from '@app/shared-misc';
import { AttachedIoModel, TemperatureWidgetConfigModel, TiltWidgetConfigModel, VoltageWidgetConfigModel, WidgetConfigModel, attachedIosIdFn } from '@app/store';

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
        portInputModes: Dictionary<PortModeName[]>,
        connectedHubIds: string[],
    ): SchemeRunBlocker[] {
        switch (widgetConfig.widgetType) {
            case WidgetType.Temperature:
                return this.getBlockersForTemperatureWidget(widgetConfig, attachedIos, portInputModes, connectedHubIds);
            case WidgetType.Tilt:
                return this.getBlockersForTiltWidget(widgetConfig, attachedIos, portInputModes, connectedHubIds);
            case WidgetType.Voltage:
                return this.getBlockersForVoltageWidget(widgetConfig, attachedIos, portInputModes, connectedHubIds);
        }
    }

    private getBlockersForVoltageWidget(
        widgetConfig: VoltageWidgetConfigModel,
        attachedIos: Dictionary<AttachedIoModel>,
        portInputModes: Dictionary<PortModeName[]>,
        connectedHubIds: string[],
    ): SchemeRunBlocker[] {
        const result: SchemeRunBlocker[] = [];
        if (!this.voltageWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? [])) {
            result.push(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }
        if (attachedIos[attachedIosIdFn(widgetConfig)] === undefined) {
            result.push(SchemeRunBlocker.SomeIosAreNotConnected);
        }
        if (!connectedHubIds.includes(widgetConfig.hubId)) {
            result.push(SchemeRunBlocker.SomeHubsAreNotConnected);
        }
        return result;
    }

    private getBlockersForTemperatureWidget(
        widgetConfig: TemperatureWidgetConfigModel,
        attachedIos: Dictionary<AttachedIoModel>,
        portInputModes: Dictionary<PortModeName[]>,
        connectedHubIds: string[],
    ): SchemeRunBlocker[] {
        const result: SchemeRunBlocker[] = [];
        if (!this.temperatureWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? [])) {
            result.push(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }
        if (attachedIos[attachedIosIdFn(widgetConfig)] === undefined) {
            result.push(SchemeRunBlocker.SomeIosAreNotConnected);
        }
        if (!connectedHubIds.includes(widgetConfig.hubId)) {
            result.push(SchemeRunBlocker.SomeHubsAreNotConnected);
        }
        return result;
    }

    private getBlockersForTiltWidget(
        widgetConfig: TiltWidgetConfigModel,
        attachedIos: Dictionary<AttachedIoModel>,
        portInputModes: Dictionary<PortModeName[]>,
        connectedHubIds: string[],
    ): SchemeRunBlocker[] {
        const result: SchemeRunBlocker[] = [];
        if (!this.tiltWidgetConfigFactoryService.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? [])) {
            result.push(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
        }
        if (attachedIos[attachedIosIdFn(widgetConfig)] === undefined) {
            result.push(SchemeRunBlocker.SomeIosAreNotConnected);
        }
        if (!connectedHubIds.includes(widgetConfig.hubId)) {
            result.push(SchemeRunBlocker.SomeHubsAreNotConnected);
        }
        return result;
    }
}
