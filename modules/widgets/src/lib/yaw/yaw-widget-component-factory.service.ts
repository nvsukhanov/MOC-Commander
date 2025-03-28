import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_ACTIONS, YawWidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor } from '@app/control-scheme-view';

import { YawWidgetComponent } from './yaw-widget.component';
import { SELECT_YAW_WIDGET_DATA } from './yaw-widget.selectors';

@Injectable()
export class YawWidgetComponentFactoryService {
  constructor(private readonly store: Store) {}

  public createWidget(container: ViewContainerRef, config: YawWidgetConfigModel): ControlSchemeWidgetDescriptor {
    const componentRef = container.createComponent(YawWidgetComponent);
    componentRef.setInput('title', config.title);

    // eslint-disable-next-line @ngrx/no-store-subscription
    const dataSub = this.store.select(SELECT_YAW_WIDGET_DATA(config)).subscribe((yaw) => {
      componentRef.setInput('yaw', yaw);
    });

    const compensateYawSub = componentRef.instance.compensate.subscribe((currentYaw) => {
      this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.compensateYaw({ ...config, currentYaw }));
    });

    const resetYawCompensationSub = componentRef.instance.resetCompensation.subscribe(() => {
      this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.resetYawCompensation(config));
    });

    return {
      edit$: componentRef.instance.edit,
      delete$: componentRef.instance.delete,
      setCanBeEdited: (canBeEdited: boolean) => componentRef.setInput('canBeEdited', canBeEdited),
      setCanBeDeleted: (canBeDeleted: boolean) => componentRef.setInput('canBeDeleted', canBeDeleted),
      destroy: (): void => {
        dataSub.unsubscribe();
        compensateYawSub.unsubscribe();
        resetYawCompensationSub.unsubscribe();
        componentRef.destroy();
      },
    };
  }
}
