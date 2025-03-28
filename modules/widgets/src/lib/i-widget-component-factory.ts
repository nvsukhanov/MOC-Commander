import { ViewContainerRef } from '@angular/core';
import { WidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor } from '@app/control-scheme-view';

export interface IWidgetComponentFactory<T extends WidgetConfigModel> {
  createWidget(container: ViewContainerRef, config: T): ControlSchemeWidgetDescriptor;
}
