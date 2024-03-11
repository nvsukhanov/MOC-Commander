import { Injectable } from '@angular/core';
import { IWidgetTypeToL10nKeyMapper } from '@app/shared-control-schemes';
import { WidgetType } from '@app/shared-misc';

@Injectable()
export class WidgetTypeToL10nKeyMapperService implements IWidgetTypeToL10nKeyMapper {
    private readonly widgetTypeToL10n: { [k in WidgetType]: string } = {
        [WidgetType.Voltage]: 'controlScheme.widgets.voltage.name',
        [WidgetType.Temperature]: 'controlScheme.widgets.temperature.name',
        [WidgetType.Pitch]: 'controlScheme.widgets.pitch.name',
        [WidgetType.Yaw]: 'controlScheme.widgets.yaw.name',
        [WidgetType.Roll]: 'controlScheme.widgets.roll.name',
    };

    public map(
        widgetType: WidgetType
    ): string {
        return this.widgetTypeToL10n[widgetType];
    }

}
