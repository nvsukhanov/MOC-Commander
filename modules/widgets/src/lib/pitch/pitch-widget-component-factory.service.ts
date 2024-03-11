import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_ACTIONS, PitchWidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetDescriptor } from '@app/control-scheme-view';

import { PitchSensorWidgetComponent } from './pitch-sensor-widget.component';
import { SELECT_PITCH_WIDGET_DATA } from './pitch-widget.selectors';

@Injectable()
export class PitchWidgetComponentFactoryService {
    constructor(
        private readonly store: Store
    ) {
    }

    public createWidget(
        container: ViewContainerRef,
        config: PitchWidgetConfigModel
    ): ControlSchemeWidgetDescriptor {
        const componentRef = container.createComponent(PitchSensorWidgetComponent);
        componentRef.setInput('title', config.title);

        // eslint-disable-next-line @ngrx/no-store-subscription
        const dataSub = this.store.select(SELECT_PITCH_WIDGET_DATA(config)).subscribe((pitch) => {
            componentRef.setInput('pitch', pitch);
        });

        const compensateTiltSub = componentRef.instance.compensate.subscribe((currentPitch) => {
            this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.compensatePitch({ ...config, currentPitch }));
        });

        const resetTiltCompensationSub = componentRef.instance.resetCompensation.subscribe(() => {
            this.store.dispatch(ATTACHED_IO_PROPS_ACTIONS.resetPitchCompensation(config));
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
