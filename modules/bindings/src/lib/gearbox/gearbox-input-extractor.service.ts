import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeGearboxControlBinding, ControlSchemeInputAction, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class GearboxInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.GearboxControl> {
    public extractInput(
        binding: ControlSchemeGearboxControlBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.NextLevel]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[ControlSchemeInputAction.PrevLevel];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[ControlSchemeInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [ControlSchemeInputAction.NextLevel]: nextLevelInputResult ?? null,
            [ControlSchemeInputAction.PrevLevel]: prevLevelInputResult ?? null,
            [ControlSchemeInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>
    ): boolean {
        return prevInput[ControlSchemeInputAction.NextLevel] !== nextInput[ControlSchemeInputAction.NextLevel]
            || prevInput[ControlSchemeInputAction.PrevLevel] !== nextInput[ControlSchemeInputAction.PrevLevel]
            || prevInput[ControlSchemeInputAction.Reset] !== nextInput[ControlSchemeInputAction.Reset];
    }

}
