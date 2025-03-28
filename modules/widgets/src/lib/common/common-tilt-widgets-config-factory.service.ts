import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import {
  AttachedIoModel,
  AttachedIoModesModel,
  AttachedIoPortModeInfoModel,
  WidgetConfigModel,
  attachedIoModesIdFn,
  attachedIoPortModeInfoIdFn,
} from '@app/store';
import { WidgetType } from '@app/shared-misc';

import { UnifiedTiltWidgetConfig } from './unified-tilt-widget-config';
import { CommonTiltWidgetsBlockerCheckerService } from './common-tilt-widgets-blocker-checker.service';

@Injectable()
export class CommonTiltWidgetsConfigFactoryService {
  constructor(private blockerChecker: CommonTiltWidgetsBlockerCheckerService) {}

  public createConfigs<T extends WidgetType.Pitch | WidgetType.Yaw | WidgetType.Roll>(
    widgetType: T,
    attachedIos: AttachedIoModel[],
    ioPortModes: Dictionary<AttachedIoModesModel>,
    portModesInfo: Dictionary<AttachedIoPortModeInfoModel>,
    existingWidgets: WidgetConfigModel[],
  ): Array<UnifiedTiltWidgetConfig & { widgetType: T }> {
    const result: Array<UnifiedTiltWidgetConfig & { widgetType: T }> = [];
    for (const io of attachedIos) {
      if (existingWidgets.some((widget) => widget.widgetType === widgetType && widget.hubId === io.hubId && widget.portId === io.portId)) {
        continue;
      }
      const portInputModeIds = ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? [];
      const attacheIoPortModes = portInputModeIds
        .map((modeId) => {
          const portModeInfo = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
          return portModeInfo ? { modeId, name: portModeInfo.name } : null;
        })
        .filter((modeInfo): modeInfo is { modeId: number; name: PortModeName } => modeInfo !== null);

      if (this.blockerChecker.canBeUsedWithInputModes(attacheIoPortModes.map((portMode) => portMode.name))) {
        const positionPortMode = attacheIoPortModes.find((name) => name.name === PortModeName.position);
        if (positionPortMode) {
          result.push(this.createConfig(widgetType, io.hubId, io.portId, positionPortMode.modeId));
        }
      }
    }
    return result;
  }

  private createConfig<T extends WidgetType.Pitch | WidgetType.Yaw | WidgetType.Roll>(
    widgetType: T,
    hubId: string,
    portId: number,
    modeId: number,
  ): UnifiedTiltWidgetConfig & { widgetType: T } {
    return {
      id: 0,
      title: '',
      widgetType,
      hubId,
      portId,
      modeId,
      valueChangeThreshold: 10,
      width: 1,
      height: 1,
      invert: false,
    } as UnifiedTiltWidgetConfig & { widgetType: T };
  }
}
