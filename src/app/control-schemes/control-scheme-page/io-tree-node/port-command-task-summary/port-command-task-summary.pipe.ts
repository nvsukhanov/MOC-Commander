import { Pipe, PipeTransform } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, PortCommandTask } from '@app/store';

import { SetSpeedPortCommandTaskSummaryBuilderService } from './set-speed-port-command-task-summary-builder.service';
import { ServoPortCommandTaskSummaryBuilderService } from './servo-port-command-task-summary-builder.service';
import { SetAnglePortCommandTaskSummaryBuilderService } from './set-angle-port-command-task-summary-builder.service';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper-port-command-task-summary-builder.service';
import { TrainControlPortCommandTaskSummaryBuilderService } from './train-control-port-command-task-summary-builder.service';
import { GearboxControlPortCommandTaskSummaryBuilderService } from './gearbox-control-port-command-task-summary-builder.service';

@Pipe({
    standalone: true,
    name: 'portCommandTaskSummary',
    pure: true
})
export class PortCommandTaskSummaryPipe implements PipeTransform {
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

    public transform(
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
