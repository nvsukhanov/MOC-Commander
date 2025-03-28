import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { WidgetType } from '@app/shared-misc';
import {
  AttachedIoModel,
  AttachedIoModesModel,
  AttachedIoPortModeInfoModel,
  TemperatureWidgetConfigModel,
  WidgetConfigModel,
  attachedIoModesIdFn,
  attachedIoPortModeInfoIdFn,
} from '@app/store';
import { IControlSchemeWidgetConfigFactory } from '@app/control-scheme-view';

import { TemperatureWidgetBlockerCheckerService } from './temperature-widget-blocker-checker.service';

@Injectable()
export class TemperatureWidgetConfigFactoryService implements IControlSchemeWidgetConfigFactory<TemperatureWidgetConfigModel> {
  constructor(private readonly blockerChecker: TemperatureWidgetBlockerCheckerService) {}

  public createConfigs(
    attachedIos: AttachedIoModel[],
    ioPortModes: Dictionary<AttachedIoModesModel>,
    portModesInfo: Dictionary<AttachedIoPortModeInfoModel>,
    existingWidgets: WidgetConfigModel[],
  ): TemperatureWidgetConfigModel[] {
    const result: TemperatureWidgetConfigModel[] = [];
    const freeIos = attachedIos.filter((io) => !existingWidgets.some((widget) => widget.hubId === io.hubId && widget.portId === io.portId));
    for (const io of freeIos) {
      const portInputModeIds = ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? [];
      for (const modeId of portInputModeIds) {
        const modeName = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })]?.name;
        if (modeName !== undefined && this.blockerChecker.canBeUsedWithInputModes([modeName])) {
          result.push(this.createConfig(io.hubId, io.portId, modeId));
        }
      }
    }
    return result;
  }

  private createConfig(hubId: string, portId: number, modeId: number): TemperatureWidgetConfigModel {
    return {
      id: 0,
      title: '',
      widgetType: WidgetType.Temperature,
      hubId,
      portId,
      modeId,
      valueChangeThreshold: 0.5,
      width: 1,
      height: 1,
    };
  }
}
