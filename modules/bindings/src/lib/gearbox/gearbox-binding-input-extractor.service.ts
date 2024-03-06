import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeGearboxBinding, ControllerInputModel, GearboxBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class GearboxBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Gearbox> {
    public extractInput(
        binding: ControlSchemeGearboxBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Gearbox> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[GearboxBindingInputAction.NextGear]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[GearboxBindingInputAction.PrevGear];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[GearboxBindingInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [GearboxBindingInputAction.NextGear]: nextLevelInputResult ?? null,
            [GearboxBindingInputAction.PrevGear]: prevLevelInputResult ?? null,
            [GearboxBindingInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Gearbox>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Gearbox>
    ): boolean {
        return prevInput[GearboxBindingInputAction.NextGear] !== nextInput[GearboxBindingInputAction.NextGear]
            || prevInput[GearboxBindingInputAction.PrevGear] !== nextInput[GearboxBindingInputAction.PrevGear]
            || prevInput[GearboxBindingInputAction.Reset] !== nextInput[GearboxBindingInputAction.Reset];
    }

}
