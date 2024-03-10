import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeGearboxBinding, ControllerInputModel, GearboxBindingInputAction } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';
import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class GearboxBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Gearbox> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeGearboxBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<ControlSchemeBindingType.Gearbox>> {
        const nextGear$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[GearboxBindingInputAction.NextGear]).pipe(
            distinctUntilIsActivatedChanged()
        );
        const prevGear$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[GearboxBindingInputAction.PrevGear]).pipe(
            distinctUntilIsActivatedChanged()
        );
        const reset$ = this.inputExtractorService.extractInputResult(binding, globalInput$, binding.inputs[GearboxBindingInputAction.Reset]).pipe(
            distinctUntilIsActivatedChanged()
        );
        return combineLatest([nextGear$, prevGear$, reset$]).pipe(
            map(([next, prev, reset]) => ({
                [GearboxBindingInputAction.NextGear]: next,
                [GearboxBindingInputAction.PrevGear]: prev,
                [GearboxBindingInputAction.Reset]: reset
            }))
        );
    }
}
