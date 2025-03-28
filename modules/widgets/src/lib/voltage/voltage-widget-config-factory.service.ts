import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';
import {
  AttachedIoModel,
  AttachedIoModesModel,
  AttachedIoPortModeInfoModel,
  VoltageWidgetConfigModel,
  WidgetConfigModel,
  attachedIoModesIdFn,
  attachedIoPortModeInfoIdFn,
} from '@app/store';
import { IControlSchemeWidgetConfigFactory } from '@app/control-scheme-view';

import { VoltageWidgetBlockerCheckerService } from './voltage-widget-blocker-checker.service';

@Injectable()
export class VoltageWidgetConfigFactoryService implements IControlSchemeWidgetConfigFactory<VoltageWidgetConfigModel> {
  constructor(private readonly blockerChecker: VoltageWidgetBlockerCheckerService) {}

  public createConfigs(
    attachedIos: AttachedIoModel[],
    ioPortModes: Dictionary<AttachedIoModesModel>,
    portModesInfo: Dictionary<AttachedIoPortModeInfoModel>,
    existingWidgets: WidgetConfigModel[],
  ): VoltageWidgetConfigModel[] {
    const result: VoltageWidgetConfigModel[] = [];
    const freeIos = attachedIos.filter((io) => !existingWidgets.some((widget) => widget.hubId === io.hubId && widget.portId === io.portId));
    for (const io of freeIos) {
      const portInputModeIds = ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? [];
      const attacheIoPortModes = portInputModeIds
        .map((modeId) => {
          const portModeInfo = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
          return portModeInfo ? { modeId, name: portModeInfo.name } : null;
        })
        .filter((modeInfo): modeInfo is { modeId: number; name: PortModeName } => modeInfo !== null);

      if (this.blockerChecker.canBeUsedWithInputModes(attacheIoPortModes.map((portMode) => portMode.name))) {
        const voltageLPortMode = attacheIoPortModes.find((name) => name.name === PortModeName.voltageL);
        if (voltageLPortMode) {
          result.push(this.createConfig(io.hubId, io.portId, voltageLPortMode.modeId));
        } else {
          const voltageSPortMode = attacheIoPortModes.find((name) => name.name === PortModeName.voltageS);
          if (voltageSPortMode) {
            result.push(this.createConfig(io.hubId, io.portId, voltageSPortMode.modeId));
          }
        }
      }
    }
    return result;
  }

  private createConfig(hubId: string, portId: number, modeId: number): VoltageWidgetConfigModel {
    return {
      id: 0,
      title: '',
      widgetType: WidgetType.Voltage,
      hubId,
      portId,
      modeId,
      valueChangeThreshold: 0.05,
      width: 1,
      height: 1,
    };
  }
}
