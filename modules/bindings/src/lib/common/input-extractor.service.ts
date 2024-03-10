import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, map, of, startWith } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControlSchemeInput, ControllerInputModel, InputGain, controllerInputIdFn } from '@app/store';

import { applyGainInputPipe } from './input-pipes';

@Injectable()
export class InputExtractorService {
    public extractInputResult<T extends ControlSchemeBinding>(
        binding: T,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        inputConfigModel: ControlSchemeInput | undefined,
    ): Observable<ControllerInputModel | null> {
        if (!inputConfigModel) {
            return of(null);
        }
        const inputId = controllerInputIdFn(inputConfigModel);
        const rawResult = globalInput$.pipe(
            startWith({} as Dictionary<ControllerInputModel>),
            map((globalInput) => globalInput[inputId] ?? null),
        );

        const pipeOperators = this.composeInputPipeOperators(inputConfigModel);
        if (pipeOperators.length === 0) {
            return rawResult;
        }
        return pipeOperators.reduce((source, pipe) => source.pipe(pipe), rawResult);
    }

    private composeInputPipeOperators(
        inputConfigModel: ControlSchemeInput
    ): Array<MonoTypeOperatorFunction<ControllerInputModel | null>> {
        const pipeOperators: Array<MonoTypeOperatorFunction<ControllerInputModel | null>> = [];
        if (inputConfigModel.gain !== InputGain.Linear) {
            pipeOperators.push(applyGainInputPipe(inputConfigModel.gain));
        }
        return pipeOperators;
    }
}
