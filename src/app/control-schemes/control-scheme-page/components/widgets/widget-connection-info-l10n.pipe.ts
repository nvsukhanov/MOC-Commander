import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

import { WidgetConnectionInfoL10nService } from './widget-connection-info-l10n.service';

@Pipe({
    standalone: true,
    name: 'widgetConnectionInfoL10n',
    pure: true
})
export class WidgetConnectionInfoL10nPipe implements PipeTransform {
    constructor(
        private readonly connectionService: WidgetConnectionInfoL10nService
    ) {
    }

    public transform(
        config: Pick<WidgetConfigModel, 'hubId' | 'portId' | 'widgetType'>
    ): Observable<string> {
        return this.connectionService.getConnectionInfo(config.widgetType, config.hubId, config.portId);
    }
}
