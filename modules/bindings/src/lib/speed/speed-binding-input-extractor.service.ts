import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSpeedBinding, ControllerInputModel, SpeedBindingInputAction } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';
import { InputExtractorService, distinctUntilValueChanged } from '../common';

@Injectable()
export class SpeedBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Speed> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeSpeedBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<ControlSchemeBindingType.Speed>> {
        const forwards$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[SpeedBindingInputAction.Forwards]).pipe(
            distinctUntilValueChanged()
        );
        const backwards$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[SpeedBindingInputAction.Backwards]).pipe(
            distinctUntilValueChanged()
        );
        const brake$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[SpeedBindingInputAction.Brake]).pipe(
            distinctUntilValueChanged()
        );

        return combineLatest([forwards$, backwards$, brake$]).pipe(
            map(([forwards, backwards, brake]) => ({
                [SpeedBindingInputAction.Forwards]: forwards,
                [SpeedBindingInputAction.Backwards]: backwards,
                [SpeedBindingInputAction.Brake]: brake
            }))
        );
    }
}
