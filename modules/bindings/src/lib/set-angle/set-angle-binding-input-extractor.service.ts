import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSetAngleBinding, ControllerInputModel, SetAngleBindingInputAction } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';
import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class SetAngleBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.SetAngle> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeSetAngleBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>> {
        return this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[SetAngleBindingInputAction.SetAngle]).pipe(
            distinctUntilIsActivatedChanged(),
            map((setAngle) => ({
                [SetAngleBindingInputAction.SetAngle]: setAngle
            }))
        );
    }
}
