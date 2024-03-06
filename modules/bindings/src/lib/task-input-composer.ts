import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControllerInputModel, ITasksInputExtractor, TaskInputExtractionResult } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { SpeedBindingInputExtractorService } from './speed';
import { BindingInputExtractionResult, IBindingTaskInputExtractor } from './i-binding-task-input-extractor';
import { GearboxBindingInputExtractorService } from './gearbox';
import { ServoBindingInputExtractorService } from './servo';
import { SetAngleBindingInputExtractorService } from './set-angle';
import { StepperBindingInputExtractorService } from './stepper';
import { TrainBindingInputExtractorService } from './train';

@Injectable()
export class TaskInputComposer implements ITasksInputExtractor {
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
