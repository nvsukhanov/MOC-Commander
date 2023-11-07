import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import {
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    VoltageWidgetConfigModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';
import { WidgetType } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class VoltageWidgetConfigFactoryService {
    public canBeUsedWithInputModes(
        portModes: PortModeName[]
    ): boolean {
        return portModes.includes(PortModeName.voltageS) || portModes.includes(PortModeName.voltageL);
    }

    public createConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>
    ): VoltageWidgetConfigModel[] {
        const result: VoltageWidgetConfigModel[] = [];
        for (const io of attachedIos) {

            const portInputModeIds = (ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? []);
            const portModeNames = portInputModeIds.map((modeId) => {
                const portModeInfo = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                return portModeInfo ? { modeId, name: portModeInfo.name } : null;
            }).filter((name): name is { modeId: number; name: PortModeName } => name !== undefined);

            if (this.canBeUsedWithInputModes(portModeNames.map((name) => name.name))) {
                const voltageLPortMode = portModeNames.find((name) => name.name === PortModeName.voltageL);
                if (voltageLPortMode) {
                    result.push(this.createConfig(io.hubId, io.portId, voltageLPortMode.modeId));
                } else {
                    const voltageSPortMode = portModeNames.find((name) => name.name === PortModeName.voltageS);
                    if (voltageSPortMode) {
                        result.push(this.createConfig(io.hubId, io.portId, voltageSPortMode.modeId));
                    }
                }
            }
        }
        return result;
    }

    private createConfig(
        hubId: string,
        portId: number,
        modeId: number,
    ): VoltageWidgetConfigModel {
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
