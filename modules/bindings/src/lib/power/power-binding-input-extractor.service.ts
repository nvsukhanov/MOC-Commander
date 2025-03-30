import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  ControlSchemePowerBinding,
  ControllerInputModel,
  ControllerSettingsModel,
  ITasksInputExtractor,
  PowerBindingInputAction,
  TaskInputs,
} from '@app/store';

import { InputExtractorService, distinctUntilValueChanged } from '../common';

@Injectable()
export class PowerBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Power> {
  constructor(private readonly inputExtractorService: InputExtractorService) {}

  public extractInputs(
    binding: ControlSchemePowerBinding,
    globalInput$: Observable<Dictionary<ControllerInputModel>>,
    controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
  ): Observable<TaskInputs<ControlSchemeBindingType.Power>> {
    const forwards$ = this.inputExtractorService
      .extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[PowerBindingInputAction.Forwards])
      .pipe(distinctUntilValueChanged());
    const backwards$ = this.inputExtractorService
      .extractInputResult(
        binding,
        globalInput$,
        controllersSettings$,
        binding.inputs[PowerBindingInputAction.Backwards],
      )
      .pipe(distinctUntilValueChanged());

    return combineLatest([forwards$, backwards$]).pipe(
      map(([forwards, backwards]) => ({
        [PowerBindingInputAction.Forwards]: forwards,
        [PowerBindingInputAction.Backwards]: backwards,
      })),
    );
  }
}
