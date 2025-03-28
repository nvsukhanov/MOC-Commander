import { Inject, Pipe, PipeTransform } from '@angular/core';
import { WidgetType } from '@app/shared-misc';

import { IWidgetTypeToL10nKeyMapper, WIDGET_TYPE_TO_L10N_KEY_MAPPER } from './i-widget-type-to-l10n-key-mapper';

@Pipe({
  standalone: true,
  name: 'widgetTypeToL10nKey',
  pure: true,
})
export class WidgetTypeToL10nKeyPipe implements PipeTransform {
  constructor(@Inject(WIDGET_TYPE_TO_L10N_KEY_MAPPER) private readonly widgetTypeToL10nKeyMapper: IWidgetTypeToL10nKeyMapper) {}

  public transform(widgetType: WidgetType): string {
    return this.widgetTypeToL10nKeyMapper.map(widgetType);
  }
}
