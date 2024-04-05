import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AccelerateBindingInputAction, ControlSchemeAccelerateBinding, ControllerInputModel } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';
import { InputExtractorService, distinctUntilValueChanged } from '../common';

@Injectable()
export class AccelerateBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Accelerate> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeAccelerateBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<ControlSchemeBindingType.Accelerate>> {
        const forwards$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[AccelerateBindingInputAction.Forwards]).pipe(
            distinctUntilValueChanged()
        );
        const backwards$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[AccelerateBindingInputAction.Backwards]).pipe(
            distinctUntilValueChanged()
        );
        const brake$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[AccelerateBindingInputAction.Slowdown]).pipe(
            distinctUntilValueChanged()
        );

        return combineLatest([forwards$, backwards$, brake$]).pipe(
            map(([forwards, backwards, brake]) => ({
                [AccelerateBindingInputAction.Forwards]: forwards,
                [AccelerateBindingInputAction.Backwards]: backwards,
                [AccelerateBindingInputAction.Slowdown]: brake
            }))
        );
    }
}
