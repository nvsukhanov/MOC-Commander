import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControllerInputModel, ITasksInputExtractor, TaskInputExtractionResult } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SpeedInputExtractorService } from './speed';
import { BindingInputExtractionResult, IBindingTaskInputExtractor } from './i-binding-task-input-extractor';
import { GearboxInputExtractorService } from './gearbox';
import { ServoInputExtractorService } from './servo';
import { SetAngleInputExtractorService } from './set-angle';
import { StepperInputExtractorService } from './stepper';
import { TrainControlTaskInputExtractorService } from './train-control';

@Injectable()
export class TaskInputComposer implements ITasksInputExtractor {
    private extractors: { [k in ControlSchemeBindingType]: IBindingTaskInputExtractor<k> } = {
        [ControlSchemeBindingType.Speed]: this.speedInputExtractor,
        [ControlSchemeBindingType.GearboxControl]: this.gearboxInputExtractor,
        [ControlSchemeBindingType.Servo]: this.servoInputExtractor,
        [ControlSchemeBindingType.SetAngle]: this.setAngleInputExtractor,
        [ControlSchemeBindingType.Stepper]: this.stepperInputExtractor,
        [ControlSchemeBindingType.TrainControl]: this.trainControlInputExtractor
    };

    constructor(
        private readonly speedInputExtractor: SpeedInputExtractorService,
        private readonly gearboxInputExtractor: GearboxInputExtractorService,
        private readonly servoInputExtractor: ServoInputExtractorService,
        private readonly setAngleInputExtractor: SetAngleInputExtractorService,
        private readonly stepperInputExtractor: StepperInputExtractorService,
        private readonly trainControlInputExtractor: TrainControlTaskInputExtractorService
    ) {
    }

    public composeInput(
        binding: ControlSchemeBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<TaskInputExtractionResult> {
        const extractor = this.getExtractor(binding.bindingType);
        return globalInput$.pipe(
            map((globalInput) => extractor.extractInput(binding, globalInput))
        );
    }

    public isInputChanged<T extends ControlSchemeBindingType>(
        bindingType: T,
        prevInput: BindingInputExtractionResult<T>,
        input: BindingInputExtractionResult<T>
    ): boolean {
        const result = this.getExtractor(bindingType).isInputChanged(prevInput, input);
        return result;
    }

    private getExtractor<T extends ControlSchemeBindingType>(bindingType: T): IBindingTaskInputExtractor<T> {
        return this.extractors[bindingType];
    }
}
