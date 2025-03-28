import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

import { IWidgetConnectionInfoProvider, WIDGET_CONNECTION_INFO_PROVIDER } from './i-widget-connection-info-provider';

@Pipe({
  standalone: true,
  name: 'widgetConnectionInfoL10n',
  pure: true,
})
export class WidgetConnectionInfoL10nPipe implements PipeTransform {
  constructor(@Inject(WIDGET_CONNECTION_INFO_PROVIDER) private readonly connectionService: IWidgetConnectionInfoProvider) {}

  public transform(config: Pick<WidgetConfigModel, 'hubId' | 'portId' | 'widgetType'>): Observable<string> {
    return this.connectionService.getConnectionInfo(config.widgetType, config.hubId, config.portId);
  }
}
