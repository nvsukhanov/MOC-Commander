import { InjectionToken, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

export type ControlSchemeWidgetDescriptor = {
  readonly edit$: Observable<void>;
  readonly delete$: Observable<void>;
  setCanBeEdited: (canBeEdited: boolean) => void;
  setCanBeDeleted: (canBeDeleted: boolean) => void;
  destroy: () => void;
};

export interface IControlSchemeWidgetComponentFactory<T extends WidgetType> {
  createWidget(container: ViewContainerRef, config: WidgetConfigModel & { widgetType: T }): ControlSchemeWidgetDescriptor;
}

export const CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY = new InjectionToken<IControlSchemeWidgetComponentFactory<WidgetType>>(
  'CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY',
);
