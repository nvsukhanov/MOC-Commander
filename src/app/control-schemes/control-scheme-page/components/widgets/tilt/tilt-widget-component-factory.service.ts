import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_ACTIONS, CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, TiltWidgetConfigModel, WidgetType } from '@app/store';

import { ControlSchemeWidgetDescriptor, IControlSchemeWidgetComponentFactory } from '../../widget-container';
import { TiltSensorWidgetComponent } from './tilt-sensor-widget';

@Injectable({ providedIn: 'root' })
export class TiltWidgetComponentFactoryService implements IControlSchemeWidgetComponentFactory<WidgetType.Tilt> {
    constructor(
        private readonly store: Store
    ) {
    }

    public createWidget(
        container: ViewContainerRef,
        config: TiltWidgetConfigModel
    ): ControlSchemeWidgetDescriptor {
        const componentRef = container.createComponent(TiltSensorWidgetComponent);
        componentRef.setInput('title', config.title);

        // eslint-disable-next-line @ngrx/no-store-subscription
        const dataSub = this.store.select(CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectWidgetTiltData(config)).subscribe((widgetData) => {
            componentRef.setInput('tilt', widgetData);
        });

        const compensateTiltSub = componentRef.instance.compensateTilt.subscribe((compensationData) => {
            this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.compensateTilt({ ...config, compensationData }));
        });

        const resetTiltCompensationSub = componentRef.instance.resetTiltCompensation.subscribe(() => {
            this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.resetTiltCompensation(config));
        });

        return {
            edit$: componentRef.instance.edit,
            delete$: componentRef.instance.delete,
            setCanBeEdited: (canBeEdited: boolean) => componentRef.setInput('canBeEdited', canBeEdited),
            setCanBeDeleted: (canBeDeleted: boolean) => componentRef.setInput('canBeDeleted', canBeDeleted),
            destroy: (): void => {
                dataSub.unsubscribe();
                compensateTiltSub.unsubscribe();
                resetTiltCompensationSub.unsubscribe();
                componentRef.destroy();
            }
        };
    }
}
