import { Injectable } from '@angular/core';
import { PortModeName } from 'rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { WidgetType } from '@app/shared-misc';
import { AttachedIoModel, WidgetConfigModel, attachedIosIdFn } from '@app/store';
import { IControlSchemeRunWidgetBlockersChecker, SchemeRunBlocker } from '@app/control-scheme-view';

import { VoltageWidgetBlockerCheckerService } from './voltage';
import { TiltWidgetBlockerCheckerService } from './tilt';
import { TemperatureWidgetBlockerCheckerService } from './temperature';
import { IWidgetBlockerChecker } from './i-widget-blocker-checker';

@Injectable()
export class ControlSchemeStartWidgetBlockerCheckerService implements IControlSchemeRunWidgetBlockersChecker {
    private readonly blockerCheckers: { [k in WidgetType]: IWidgetBlockerChecker } = {
        [WidgetType.Temperature]: this.temperatureBlockerChecker,
        [WidgetType.Tilt]: this.tiltBlockerChecker,
        [WidgetType.Voltage]: this.voltageBlockerChecker,
    };

    constructor(
        private readonly voltageBlockerChecker: VoltageWidgetBlockerCheckerService,
        private readonly tiltBlockerChecker: TiltWidgetBlockerCheckerService,
        private readonly temperatureBlockerChecker: TemperatureWidgetBlockerCheckerService,
    ) {
    }

    public getBlockers(
        widgetConfig: WidgetConfigModel,
        attachedIos: Dictionary<AttachedIoModel>,
        portInputModes: Dictionary<PortModeName[]>,
        connectedHubIds: string[],
    ): SchemeRunBlocker[] {
        const blockChecker = this.blockerCheckers[widgetConfig.widgetType];
        const result: SchemeRunBlocker[] = [];
        if (!blockChecker.canBeUsedWithInputModes(portInputModes[attachedIosIdFn(widgetConfig)] ?? [])) {
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
