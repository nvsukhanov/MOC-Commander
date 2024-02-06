import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, WidgetConfigModel } from '@app/store';
import { IControlSchemeWidgetConfigFactory } from '@app/control-scheme-view';

import { VoltageWidgetConfigFactoryService } from './voltage';
import { TiltWidgetConfigFactoryService } from './tilt';
import { TemperatureWidgetConfigFactoryService } from './temperature';

@Injectable()
export class WidgetConfigFactoryService implements IControlSchemeWidgetConfigFactory {
    constructor(
        private readonly voltageWidgetConfigFactoryService: VoltageWidgetConfigFactoryService,
        private readonly tiltWidgetConfigFactoryService: TiltWidgetConfigFactoryService,
        private readonly temperatureWidgetConfigFactoryService: TemperatureWidgetConfigFactoryService,
    ) {
    }

    public createConfigs(
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
