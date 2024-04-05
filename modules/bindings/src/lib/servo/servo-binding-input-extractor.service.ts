import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    ControlSchemeServoBinding,
    ControllerInputModel,
    ControllerSettingsModel,
    ITasksInputExtractor,
    ServoBindingInputAction,
    TaskInputs
} from '@app/store';

import { InputExtractorService, distinctUntilValueChanged } from '../common';

@Injectable()
export class ServoBindingInputExtractorService implements ITasksInputExtractor<ControlSchemeBindingType.Servo> {
    constructor(
        private readonly inputExtractorService: InputExtractorService
    ) {
    }

    public extractInputs(
        binding: ControlSchemeServoBinding,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
    ): Observable<TaskInputs<ControlSchemeBindingType.Servo>> {
        const cw$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[ServoBindingInputAction.Cw]
        ).pipe(
            distinctUntilValueChanged()
        );
        const ccw$ = this.inputExtractorService.extractInputResult(
            binding,
            globalInput$,
            controllersSettings$,
            binding.inputs[ServoBindingInputAction.Ccw]
        ).pipe(
            distinctUntilValueChanged()
        );
        return combineLatest([cw$, ccw$]).pipe(
            map(([cw, ccw]) => ({
                [ServoBindingInputAction.Cw]: cw,
                [ServoBindingInputAction.Ccw]: ccw
            }))
        );
    }
}
