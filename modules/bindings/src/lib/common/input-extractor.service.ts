import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, map, of, startWith } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControlSchemeInputConfig, ControllerInputModel, InputPipeType, controllerInputIdFn } from '@app/store';

import { applyGainInputPipe } from './input-pipes';

@Injectable()
export class InputExtractorService {
    public extractInputResult<T extends ControlSchemeBinding>(
        binding: T,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        inputConfigModel: ControlSchemeInputConfig | undefined,
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
        inputConfigModel: ControlSchemeInputConfig
    ): Array<MonoTypeOperatorFunction<ControllerInputModel | null>> {
        return inputConfigModel.inputPipes.map((pipeConfig) => {
            switch (pipeConfig.type) {
                case InputPipeType.Gain:
                    return applyGainInputPipe(pipeConfig.gain);
            }
        });
    }
}
