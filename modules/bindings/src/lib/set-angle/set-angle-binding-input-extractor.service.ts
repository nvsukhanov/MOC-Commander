import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  ControlSchemeSetAngleBinding,
  ControllerInputModel,
  ControllerSettingsModel,
  ITasksInputExtractor,
  SetAngleBindingInputAction,
  TaskInputs,
} from '@app/store';

import { InputExtractorService, distinctUntilIsActivatedChanged } from '../common';

@Injectable()
export class SetAngleBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.SetAngle> {
  constructor(private readonly inputExtractorService: InputExtractorService) {}

  public extractInputs(
    binding: ControlSchemeSetAngleBinding,
    globalInput$: Observable<Dictionary<ControllerInputModel>>,
    controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
  ): Observable<TaskInputs<ControlSchemeBindingType.SetAngle>> {
    return this.inputExtractorService.extractInputResult(binding, globalInput$, controllersSettings$, binding.inputs[SetAngleBindingInputAction.SetAngle]).pipe(
      distinctUntilIsActivatedChanged(),
      map((setAngle) => ({
        [SetAngleBindingInputAction.SetAngle]: setAngle,
      })),
    );
  }
}
