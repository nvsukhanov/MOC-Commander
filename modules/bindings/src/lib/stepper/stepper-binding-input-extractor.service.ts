import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    ControlSchemeStepperBinding,
    ControllerInputModel,
    ControllerSettingsModel,
    ITasksInputExtractor,
    StepperBindingInputAction,
    TaskInputs
} from '@app/store';

import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class StepperBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Stepper> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeStepperBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
    ): Observable<TaskInputs<ControlSchemeBindingType.Stepper>> {
        const cw$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[StepperBindingInputAction.Cw]
        ).pipe(
            distinctUntilIsActivatedChanged()
        );
        const ccw$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[StepperBindingInputAction.Ccw]
        ).pipe(
            distinctUntilIsActivatedChanged()
        );
        return combineLatest([cw$, ccw$]).pipe(
            map(([cw, ccw]) => ({
                [StepperBindingInputAction.Cw]: cw,
                [StepperBindingInputAction.Ccw]: ccw
            }))
        );
    }
}
