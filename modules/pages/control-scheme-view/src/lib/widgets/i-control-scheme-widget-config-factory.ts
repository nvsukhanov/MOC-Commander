import { Dictionary } from '@ngrx/entity';
import { InjectionToken } from '@angular/core';
import { AttachedIoModel, AttachedIoModesModel, AttachedIoPortModeInfoModel, WidgetConfigModel } from '@app/store';

export interface IControlSchemeWidgetConfigFactory<T extends WidgetConfigModel = WidgetConfigModel> {
    createConfigs(
        attachedIos: AttachedIoModel[],
        ioPortModes: Dictionary<AttachedIoModesModel>,
        portModesInfo: Dictionary<AttachedIoPortModeInfoModel>
    ): T[];
}

export const CONTROL_SCHEME_WIDGET_CONFIG_FACTORY =
    new InjectionToken<IControlSchemeWidgetConfigFactory<WidgetConfigModel>>('CONTROL_SCHEME_WIDGET_CONFIG_FACTORY');
