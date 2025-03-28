import { Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { ControlSchemeBinding, ControlSchemeBindingInputs, ControllerInputModel, ControllerSettingsModel } from '../../models';

export type TaskInput = {
  readonly value: number;
  readonly isActivated: boolean;
  readonly timestamp: number;
};

export type TaskInputs<T extends ControlSchemeBindingType = ControlSchemeBindingType> = {
  [k in keyof ControlSchemeBindingInputs<T>]?: TaskInput;
};

export interface ITasksInputExtractor<T extends ControlSchemeBindingType = ControlSchemeBindingType> {
  extractInputs(
    binding: ControlSchemeBinding & { bindingType: T },
    input: Observable<Dictionary<ControllerInputModel>>,
    controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
  ): Observable<TaskInputs<T>>;
}

export const TASKS_INPUT_EXTRACTOR = new InjectionToken<ITasksInputExtractor>('TASKS_INPUT_EXTRACTOR');
