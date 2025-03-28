import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  ControlSchemeGearboxBinding,
  ControllerInputModel,
  ControllerSettingsModel,
  GearboxBindingInputAction,
  ITasksInputExtractor,
  TaskInputs,
} from '@app/store';

import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class GearboxBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Gearbox> {
  constructor(private readonly inputExtractorService: InputExtractorService) {}

  public extractInputs(
    binding: ControlSchemeGearboxBinding,
    globalInput$: Observable<Dictionary<ControllerInputModel>>,
    controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
  ): Observable<TaskInputs<ControlSchemeBindingType.Gearbox>> {
    const nextGear$ = this.inputExtractorService
      .extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[GearboxBindingInputAction.NextGear])
      .pipe(distinctUntilIsActivatedChanged());
    const prevGear$ = this.inputExtractorService
      .extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[GearboxBindingInputAction.PrevGear])
      .pipe(distinctUntilIsActivatedChanged());
    const reset$ = this.inputExtractorService
      .extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[GearboxBindingInputAction.Reset])
      .pipe(distinctUntilIsActivatedChanged());
    return combineLatest([nextGear$, prevGear$, reset$]).pipe(
      map(([next, prev, reset]) => ({
        [GearboxBindingInputAction.NextGear]: next,
        [GearboxBindingInputAction.PrevGear]: prev,
        [GearboxBindingInputAction.Reset]: reset,
      })),
    );
  }
}
