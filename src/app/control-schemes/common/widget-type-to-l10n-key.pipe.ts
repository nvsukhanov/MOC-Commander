import { Pipe, PipeTransform } from '@angular/core';
import { WidgetType } from '@app/store';

@Pipe({
    standalone: true,
    name: 'widgetTypeToL10nKey',
    pure: true
})
export class WidgetTypeToL10nKeyPipe implements PipeTransform {
    private readonly widgetTypeToL10n: { [k in WidgetType]: string } = {
        [WidgetType.Voltage]: 'controlScheme.widgets.voltage.name',
        [WidgetType.Tilt]: 'controlScheme.widgets.tilt.name',
    };

    public transform(
        widgetType: WidgetType
    ): string {
        return this.widgetTypeToL10n[widgetType];
    }
}
