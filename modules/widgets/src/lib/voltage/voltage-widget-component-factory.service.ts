import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { WidgetType } from '@app/shared-misc';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, VoltageWidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor } from '@app/control-scheme-view';

import { WidgetConnectionInfoL10nService } from '../widget-connection-info-l10n.service';
import { IWidgetComponentFactory } from '../i-widget-component-factory';
import { VoltageSensorWidgetComponent } from './widget';

@Injectable()
export class VoltageWidgetComponentFactoryService implements IWidgetComponentFactory<VoltageWidgetConfigModel> {
  constructor(
    private readonly widgetConnectionInfoL10nService: WidgetConnectionInfoL10nService,
    private readonly store: Store,
  ) {}

  public createWidget(container: ViewContainerRef, config: VoltageWidgetConfigModel): ControlSchemeWidgetDescriptor {
    const componentRef = container.createComponent(VoltageSensorWidgetComponent);
    componentRef.setInput('title', config.title);

    // eslint-disable-next-line @ngrx/no-store-subscription
    const dataSub = this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(config.id)).subscribe((widgetData) => {
      if (widgetData?.widgetType === WidgetType.Voltage) {
        componentRef.setInput('voltage', widgetData.voltage);
      } else {
        componentRef.setInput('voltage', undefined);
      }
    });

    const subtitleSub = this.widgetConnectionInfoL10nService.getConnectionInfo(config.widgetType, config.hubId, config.portId).subscribe((subtitle) => {
      componentRef.setInput('subtitle', subtitle);
    });

    return {
      edit$: componentRef.instance.edit,
      delete$: componentRef.instance.delete,
      setCanBeEdited: (canBeEdited: boolean) => componentRef.setInput('canBeEdited', canBeEdited),
      setCanBeDeleted: (canBeDeleted: boolean) => componentRef.setInput('canBeDeleted', canBeDeleted),
      destroy: (): void => {
        dataSub.unsubscribe();
        subtitleSub.unsubscribe();
        componentRef.destroy();
      },
    };
  }
}
