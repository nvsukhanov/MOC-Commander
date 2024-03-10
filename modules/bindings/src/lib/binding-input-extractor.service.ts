import { Injectable } from '@angular/core';
import { Observable, sample } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControllerInputModel, ITasksInputExtractor, TaskInputExtractionResult } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SpeedBindingInputExtractorService } from './speed';
import { IBindingTaskInputExtractor } from './i-binding-task-input-extractor';
import { GearboxBindingInputExtractorService } from './gearbox';
import { ServoBindingInputExtractorService } from './servo';
import { SetAngleBindingInputExtractorService } from './set-angle';
import { StepperBindingInputExtractorService } from './stepper';
import { TrainBindingInputExtractorService } from './train';

@Injectable()
export class BindingInputExtractorService implements ITasksInputExtractor {
    private extractors: { [k in ControlSchemeBindingType]: IBindingTaskInputExtractor<k> } = {
        [ControlSchemeBindingType.Speed]: this.speedBindingInputExtractor,
        [ControlSchemeBindingType.Gearbox]: this.gearboxBindingInputExtractor,
        [ControlSchemeBindingType.Servo]: this.servoBindingInputExtractor,
        [ControlSchemeBindingType.SetAngle]: this.setAngleBindingInputExtractor,
        [ControlSchemeBindingType.Stepper]: this.stepperBindingInputExtractor,
        [ControlSchemeBindingType.Train]: this.trainBindingInputExtractor
    };

    constructor(
        private readonly speedBindingInputExtractor: SpeedBindingInputExtractorService,
        private readonly gearboxBindingInputExtractor: GearboxBindingInputExtractorService,
        private readonly servoBindingInputExtractor: ServoBindingInputExtractorService,
        private readonly setAngleBindingInputExtractor: SetAngleBindingInputExtractorService,
        private readonly stepperBindingInputExtractor: StepperBindingInputExtractorService,
        private readonly trainBindingInputExtractor: TrainBindingInputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<TaskInputExtractionResult> {
        return this.getExtractor(binding.bindingType).extractInputs(binding, globalInput$).pipe(
            // we use sample here to ensure that inputs observables emits in sync with globalInput$ (since there is a usage of
            // combineLatest in the extractInputs method of the extractors). TODO: find a better way to do this
            sample(globalInput$),
        );
    }

    private getExtractor<T extends ControlSchemeBindingType>(bindingType: T): IBindingTaskInputExtractor<T> {
        return this.extractors[bindingType];
    }
}
