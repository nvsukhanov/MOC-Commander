import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  ControlSchemeTrainBinding,
  ControllerInputModel,
  ControllerSettingsModel,
  ITasksInputExtractor,
  TaskInputs,
  TrainBindingInputAction,
} from '@app/store';

import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class TrainBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Train> {
  constructor(private readonly inputExtractorService: InputExtractorService) {}

  public extractInputs(
    binding: ControlSchemeTrainBinding,
    globalInput$: Observable<Dictionary<ControllerInputModel>>,
    controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
  ): Observable<TaskInputs<ControlSchemeBindingType.Train>> {
    const nextSpeed$ = this.inputExtractorService
      .extractInputResult(
        binding,
        globalInput$,
        controllersSettings$,
        binding.inputs[TrainBindingInputAction.NextSpeed],
      )
      .pipe(distinctUntilIsActivatedChanged());
    const prevSpeed$ = this.inputExtractorService
      .extractInputResult(
        binding,
        globalInput$,
        controllersSettings$,
        binding.inputs[TrainBindingInputAction.PrevSpeed],
      )
      .pipe(distinctUntilIsActivatedChanged());
    const reset$ = this.inputExtractorService
      .extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[TrainBindingInputAction.Reset])
      .pipe(distinctUntilIsActivatedChanged());
    return combineLatest([nextSpeed$, prevSpeed$, reset$]).pipe(
      map(([next, prev, reset]) => ({
        [TrainBindingInputAction.NextSpeed]: next,
        [TrainBindingInputAction.PrevSpeed]: prev,
        [TrainBindingInputAction.Reset]: reset,
      })),
    );
  }
}
