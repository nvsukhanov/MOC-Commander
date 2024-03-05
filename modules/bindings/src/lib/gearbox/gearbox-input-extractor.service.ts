import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeGearboxControlBinding, ControllerInputModel, GearboxControlInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class GearboxInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.GearboxControl> {
    public extractInput(
        binding: ControlSchemeGearboxControlBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[GearboxControlInputAction.NextGear]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[GearboxControlInputAction.PrevGear];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[GearboxControlInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [GearboxControlInputAction.NextGear]: nextLevelInputResult ?? null,
            [GearboxControlInputAction.PrevGear]: prevLevelInputResult ?? null,
            [GearboxControlInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.GearboxControl>
    ): boolean {
        return prevInput[GearboxControlInputAction.NextGear] !== nextInput[GearboxControlInputAction.NextGear]
            || prevInput[GearboxControlInputAction.PrevGear] !== nextInput[GearboxControlInputAction.PrevGear]
            || prevInput[GearboxControlInputAction.Reset] !== nextInput[GearboxControlInputAction.Reset];
    }

}
