import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, WidgetConfigModel } from '@app/store';
import { IControlSchemeWidgetConfigFactory } from '@app/control-scheme-view';
import { WidgetType } from '@app/shared-misc';

import { VoltageWidgetConfigFactoryService } from './voltage';
import { TemperatureWidgetConfigFactoryService } from './temperature';
import { CommonTiltWidgetsConfigFactoryService } from './common/common-tilt-widgets-config-factory.service';

@Injectable()
export class WidgetConfigFactoryService implements IControlSchemeWidgetConfigFactory {
    constructor(
        private readonly voltageWidgetConfigFactoryService: VoltageWidgetConfigFactoryService,
        private readonly temperatureWidgetConfigFactoryService: TemperatureWidgetConfigFactoryService,
        private readonly commonTiltWidgetsConfigFactoryService: CommonTiltWidgetsConfigFactoryService
    ) {
    }

    public createConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>,
        existingWidgets: WidgetConfigModel[]
    ): WidgetConfigModel[] {
        return [
            ...this.voltageWidgetConfigFactoryService.createConfigs(attachedIos, ioPortModes, portModesInfo, existingWidgets),
            ...this.temperatureWidgetConfigFactoryService.createConfigs(attachedIos, ioPortModes, portModesInfo, existingWidgets),
            ...this.commonTiltWidgetsConfigFactoryService.createConfigs(WidgetType.Pitch, attachedIos, ioPortModes, portModesInfo, existingWidgets),
            ...this.commonTiltWidgetsConfigFactoryService.createConfigs(WidgetType.Yaw, attachedIos, ioPortModes, portModesInfo, existingWidgets),
            ...this.commonTiltWidgetsConfigFactoryService.createConfigs(WidgetType.Roll, attachedIos, ioPortModes, portModesInfo, existingWidgets),
        ];
    }
}
