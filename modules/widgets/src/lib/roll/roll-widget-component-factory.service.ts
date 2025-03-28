import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_ACTIONS, RollWidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor } from '@app/control-scheme-view';

import { RollWidgetComponent } from './roll-widget.component';
import { SELECT_ROLL_WIDGET_DATA } from './roll-widget.selectors';

@Injectable()
export class RollWidgetComponentFactoryService {
  constructor(private readonly store: Store) {}

  public createWidget(container: ViewContainerRef, config: RollWidgetConfigModel): ControlSchemeWidgetDescriptor {
    const componentRef = container.createComponent(RollWidgetComponent);
    componentRef.setInput('title', config.title);

    // eslint-disable-next-line @ngrx/no-store-subscription
    const dataSub = this.store.select(SELECT_ROLL_WIDGET_DATA(config)).subscribe((roll) => {
      componentRef.setInput('roll', roll);
    });

    const compensateRollSub = componentRef.instance.compensate.subscribe((currentRoll) => {
      this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.compensateRoll({ ...config, currentRoll }));
    });

    const resetRollCompensationSub = componentRef.instance.resetCompensation.subscribe(() => {
      this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.resetRollCompensation(config));
    });

    return {
      edit$: componentRef.instance.edit,
      delete$: componentRef.instance.delete,
      setCanBeEdited: (canBeEdited: boolean) => componentRef.setInput('canBeEdited', canBeEdited),
      setCanBeDeleted: (canBeDeleted: boolean) => componentRef.setInput('canBeDeleted', canBeDeleted),
      destroy: (): void => {
        dataSub.unsubscribe();
        compensateRollSub.unsubscribe();
        resetRollCompensationSub.unsubscribe();
        componentRef.destroy();
      },
    };
  }
}
