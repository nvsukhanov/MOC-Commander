import { Injectable } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { IPortCommandTaskSummaryBuilder } from '@app/control-scheme-view';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SetSpeedPortCommandTaskSummaryBuilderService } from './set-speed';
import { SetAnglePortCommandTaskSummaryBuilderService } from './set-angle';
import { ServoPortCommandTaskSummaryBuilderService } from './servo';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper';
import { TrainControlPortCommandTaskSummaryBuilderService } from './train-control';
import { GearboxControlPortCommandTaskSummaryBuilderService } from './gearbox';

@Injectable()
export class BindingTaskSummaryBuilderService implements IPortCommandTaskSummaryBuilder {
    constructor(
        private readonly setSpeedPortCommandTaskSummaryBuilder: SetSpeedPortCommandTaskSummaryBuilderService,
        private readonly setAnglePortCommandTaskSummaryBuilder: SetAnglePortCommandTaskSummaryBuilderService,
        private readonly servoPortCommandTaskSummaryBuilder: ServoPortCommandTaskSummaryBuilderService,
        private readonly stepperPortCommandTaskSummaryBuilder: StepperPortCommandTaskSummaryBuilderService,
        private readonly trainControlPortCommandTaskSummaryBuilder: TrainControlPortCommandTaskSummaryBuilderService,
        private readonly gearboxControlPortCommandTaskSummaryBuilder: GearboxControlPortCommandTaskSummaryBuilderService,
        private readonly store: Store
    ) {
    }

    public buildTaskSummary(
        portCommandTask: PortCommandTask
    ): Observable<string> {
        const payload = portCommandTask.payload;
        switch (payload.bindingType) {
            case ControlSchemeBindingType.SetSpeed:
                return this.setSpeedPortCommandTaskSummaryBuilder.build(payload);
            case ControlSchemeBindingType.SetAngle:
                return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(portCommandTask)).pipe(
                    filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
                    switchMap((ioProps) => this.setAnglePortCommandTaskSummaryBuilder.build(
                        ioProps,
                        payload
                    ))
                );
            case ControlSchemeBindingType.Servo:
                return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(portCommandTask)).pipe(
                    filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
                    switchMap((ioProps) => this.servoPortCommandTaskSummaryBuilder.build(
                        ioProps,
                        payload
                    ))
                );
            case ControlSchemeBindingType.Stepper:
                return this.stepperPortCommandTaskSummaryBuilder.build(payload);
            case ControlSchemeBindingType.TrainControl:
                return this.trainControlPortCommandTaskSummaryBuilder.build(payload);
            case ControlSchemeBindingType.GearboxControl:
                return this.gearboxControlPortCommandTaskSummaryBuilder.build(payload);
        }
    }
}
