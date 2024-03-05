import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';
import {
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    TiltWidgetConfigModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';
import { IControlSchemeWidgetConfigFactory } from '@app/control-scheme-view';

import { TiltWidgetBlockerCheckerService } from './tilt-widget-blocker-checker.service';

@Injectable()
export class TiltWidgetConfigFactoryService implements IControlSchemeWidgetConfigFactory<TiltWidgetConfigModel> {
    constructor(
        private blockerChecker: TiltWidgetBlockerCheckerService
    ) {
    }

    public createConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>
    ): TiltWidgetConfigModel[] {
        const result: TiltWidgetConfigModel[] = [];
        for (const io of attachedIos) {
            const portInputModeIds = (ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? []);
            const attacheIoPortModes = portInputModeIds.map((modeId) => {
                const portModeInfo = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                return portModeInfo ? { modeId, name: portModeInfo.name } : null;
            }).filter((modeInfo): modeInfo is { modeId: number; name: PortModeName } => modeInfo !== null);

            if (this.blockerChecker.canBeUsedWithInputModes(attacheIoPortModes.map((portMode) => portMode.name))) {
                const positionPortMode = attacheIoPortModes.find((name) => name.name === PortModeName.position);
                if (positionPortMode) {
                    result.push(this.createConfig(io.hubId, io.portId, positionPortMode.modeId));
                }
            }
        }
        return result;
    }

    private createConfig(
        hubId: string,
        portId: number,
        modeId: number,
    ): TiltWidgetConfigModel {
        return {
            id: 0,
            title: '',
            widgetType: WidgetType.Tilt,
            hubId,
            portId,
            modeId,
            valueChangeThreshold: 5,
            width: 2,
            height: 2,
            invertYaw: false,
            invertPitch: false,
            invertRoll: false,
        };
    }
}
