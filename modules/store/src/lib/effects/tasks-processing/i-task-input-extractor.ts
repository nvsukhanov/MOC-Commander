import { Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { ControlSchemeBinding, ControlSchemeBindingInputs, ControllerInputModel } from '../../models';

export type TaskInputExtractionResult<T extends ControlSchemeBindingType = ControlSchemeBindingType> = {
    [ k in keyof ControlSchemeBindingInputs<T> ]: ControllerInputModel | null
};

export interface ITasksInputExtractor<T extends ControlSchemeBindingType = ControlSchemeBindingType> {
    extractInputs(
        binding: ControlSchemeBinding & { bindingType: T },
        input: Observable<Dictionary<ControllerInputModel>>
    ): Observable<TaskInputExtractionResult<T>>;
}

export const TASKS_INPUT_EXTRACTOR = new InjectionToken<ITasksInputExtractor>('TASKS_INPUT_EXTRACTOR');
