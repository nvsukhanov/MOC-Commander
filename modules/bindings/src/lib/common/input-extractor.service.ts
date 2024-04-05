import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, combineLatest, map, of, startWith } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import {
    ControlSchemeBinding,
    ControlSchemeInputConfig,
    ControllerInputModel,
    ControllerSettingsModel,
    InputPipeType,
    TaskInput,
    controllerInputIdFn,
    isControllerInputActivated,
    transformControllerInputValue
} from '@app/store';

import { applyGainInputPipe, onOffInputPipe } from './input-pipes';

@Injectable()
export class InputExtractorService {
    public extractInputResult<T extends ControlSchemeBinding>(
        binding: T,
        globalInput$: Observable<Dictionary<ControllerInputModel>>,
        controllersSettings$: Observable<Dictionary<ControllerSettingsModel>>,
        inputConfigModel: ControlSchemeInputConfig | undefined,
    ): Observable<TaskInput | undefined> {
        if (!inputConfigModel) {
            return of(undefined);
        }
        const inputId = controllerInputIdFn(inputConfigModel);
        const initialInput$: Observable<TaskInput | undefined> = combineLatest([
            globalInput$,
            controllersSettings$
        ]).pipe(
            startWith([{}, {}] as [Dictionary<ControllerInputModel>, Dictionary<ControllerSettingsModel>]),
            map(([globalInput, controllerSettings]) => {
                const inputModel = globalInput[inputId];
                if (!inputModel) {
                    return;
                }
                const settings = controllerSettings[inputModel.controllerId];
                if (!settings) {
                    return;
                }
                return {
                    value: transformControllerInputValue(inputModel, settings),
                    isActivated: isControllerInputActivated(inputModel, settings),
                    timestamp: inputModel.timestamp,
                };
            }),
        );

        const pipeOperators = this.composeInputPipeOperators(inputConfigModel);
        if (pipeOperators.length === 0) {
            return initialInput$;
        }
        return pipeOperators.reduce((source, pipe) => source.pipe(pipe), initialInput$);
    }

    private composeInputPipeOperators(
        inputConfigModel: ControlSchemeInputConfig
    ): Array<MonoTypeOperatorFunction<TaskInput | undefined>> {
        return inputConfigModel.inputPipes.map((pipeConfig) => {
            switch (pipeConfig.type) {
                case InputPipeType.LogarithmicGain:
                case InputPipeType.ExponentialGain:
                    return applyGainInputPipe(pipeConfig.type);
                case InputPipeType.OnOffToggle:
                    return onOffInputPipe();
            }
        });
    }
}
