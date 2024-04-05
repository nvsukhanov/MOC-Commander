import { Injectable } from '@angular/core';
import { Observable, asapScheduler, debounceTime } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControllerInputModel, ControllerSettingsModel, ITasksInputExtractor, TaskInputs } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SpeedBindingInputExtractorService } from './speed';
import { GearboxBindingInputExtractorService } from './gearbox';
import { ServoBindingInputExtractorService } from './servo';
import { SetAngleBindingInputExtractorService } from './set-angle';
import { StepperBindingInputExtractorService } from './stepper';
import { TrainBindingInputExtractorService } from './train';
import { AccelerateBindingInputExtractorService } from './accelerate';

@Injectable()
export class BindingInputExtractorService implements ITasksInputExtractor {
    private extractors: { [k in ControlSchemeBindingType]: ITasksInputExtractor<k> } = {
        [ControlSchemeBindingType.Speed]: this.speedBindingInputExtractor,
        [ControlSchemeBindingType.Gearbox]: this.gearboxBindingInputExtractor,
        [ControlSchemeBindingType.Servo]: this.servoBindingInputExtractor,
        [ControlSchemeBindingType.SetAngle]: this.setAngleBindingInputExtractor,
        [ControlSchemeBindingType.Stepper]: this.stepperBindingInputExtractor,
        [ControlSchemeBindingType.Train]: this.trainBindingInputExtractor,
        [ControlSchemeBindingType.Accelerate]: this.accelerateBindingInputExtractor
    };

    constructor(
        private readonly speedBindingInputExtractor: SpeedBindingInputExtractorService,
        private readonly gearboxBindingInputExtractor: GearboxBindingInputExtractorService,
        private readonly servoBindingInputExtractor: ServoBindingInputExtractorService,
        private readonly setAngleBindingInputExtractor: SetAngleBindingInputExtractorService,
        private readonly stepperBindingInputExtractor: StepperBindingInputExtractorService,
        private readonly trainBindingInputExtractor: TrainBindingInputExtractorService,
        private readonly accelerateBindingInputExtractor: AccelerateBindingInputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
    ): Observable<TaskInputs> {
        return this.getExtractor(binding.bindingType).extractInputs(binding, globalInput$, controllersSettings$).pipe(
            // we use debounceTime here to ensure that all inputs observables emits synchronously (this is needed because we use
            // combineLatest in the extractInputs method of the extractors)
            debounceTime(0, asapScheduler)
        );
    }

    private getExtractor<T extends ControlSchemeBindingType>(bindingType: T): ITasksInputExtractor<T> {
        return this.extractors[bindingType];
    }
}
