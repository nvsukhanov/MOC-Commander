import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, WidgetConfigModel } from '@app/store';

import { TemperatureWidgetConfigFactoryService, TiltWidgetConfigFactoryService, VoltageWidgetConfigFactoryService } from './widgets';

@Injectable({ providedIn: 'root' })
export class ControlSchemeWidgetDefaultConfigFactoryService {
    constructor(
        private readonly voltageWidgetConfigFactoryService: VoltageWidgetConfigFactoryService,
        private readonly tiltWidgetConfigFactoryService: TiltWidgetConfigFactoryService,
        private readonly temperatureWidgetConfigFactoryService: TemperatureWidgetConfigFactoryService,
    ) {
    }

    public createAddableConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>
    ): WidgetConfigModel[] {
        return [
            ...this.voltageWidgetConfigFactoryService.createConfigs(attachedIos, ioPortModes, portModesInfo),
            ...this.tiltWidgetConfigFactoryService.createConfigs(attachedIos, ioPortModes, portModesInfo),
            ...this.temperatureWidgetConfigFactoryService.createConfigs(attachedIos, ioPortModes, portModesInfo),
        ];
    }
}
