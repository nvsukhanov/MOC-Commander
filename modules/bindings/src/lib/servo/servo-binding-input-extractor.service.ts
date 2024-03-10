import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeServoBinding, ControllerInputModel, ServoBindingInputAction } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';
import { InputExtractorService, distinctUntilValueChanged } from '../common';

@Injectable()
export class ServoBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Servo> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeServoBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<ControlSchemeBindingType.Servo>> {
        const cw$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[ServoBindingInputAction.Cw]).pipe(
            distinctUntilValueChanged()
        );
        const ccw$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[ServoBindingInputAction.Ccw]).pipe(
            distinctUntilValueChanged()
        );
        return combineLatest([cw$, ccw$]).pipe(
            map(([cw, ccw]) => ({
                [ServoBindingInputAction.Cw]: cw,
                [ServoBindingInputAction.Ccw]: ccw
            }))
        );
    }
}
