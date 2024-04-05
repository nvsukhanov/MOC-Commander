import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AccelerateBindingInputAction,
    ControlSchemeAccelerateBinding,
    ControllerInputModel,
    ControllerSettingsModel,
    ITasksInputExtractor,
    TaskInputs
} from '@app/store';

import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class AccelerateBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Accelerate> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeAccelerateBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
    ): Observable<TaskInputs<ControlSchemeBindingType.Accelerate>> {
        const forwards$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[AccelerateBindingInputAction.Forwards]
        ).pipe(
            distinctUntilIsActivatedChanged()
        );
        const backwards$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[AccelerateBindingInputAction.Backwards]
        ).pipe(
            distinctUntilIsActivatedChanged()
        );
        const brake$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[AccelerateBindingInputAction.Slowdown]
        ).pipe(
            distinctUntilIsActivatedChanged()
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
