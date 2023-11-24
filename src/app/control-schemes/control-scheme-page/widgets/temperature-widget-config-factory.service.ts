import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';
import {
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    TemperatureWidgetConfigModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '@app/store';

@Injectable({ providedIn: 'root' })
export class TemperatureWidgetConfigFactoryService {
    public canBeUsedWithInputModes(
        portModes: PortModeName[]
    ): boolean {
        return portModes.includes(PortModeName.temperature);
    }

    public createConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>
    ): TemperatureWidgetConfigModel[] {
        const result: TemperatureWidgetConfigModel[] = [];
        for (const io of attachedIos) {

            const portInputModeIds = (ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? []);

            for (const modeId of portInputModeIds) {
                const modeName = portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })]?.name;
                if (modeName !== undefined && this.canBeUsedWithInputModes([modeName])) {
                    result.push(this.createConfig(io.hubId, io.portId, modeId));
                }
            }
        }
        return result;
    }

    private createConfig(
        hubId: string,
        portId: number,
        modeId: number,
    ): TemperatureWidgetConfigModel {
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
